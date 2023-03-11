// Params
var config = {
  device_width: 576,
  max_img_width: 576,
  max_img_height: 1024,
  tmp_path: `./tmp`
};

$app.theme = "auto";
// memobird library
const memobird = require("./scripts/memobird");
const printer = memobird.GetPrinter();
// showdown library
const showdown = require("./3rdparty/showdown.min");
const { bear } = require("./3rdparty/showdown-bear");
bear(showdown);
const converter = new showdown.Converter({ tables: true, simpleLineBreaks: true});
converter.useExtension("polar-bear");
// base64
const {
  byteLength,
  toByteArray,
  fromByteArray
} = require("./3rdparty/base64js.min");

const Config = require("./scripts/config");
const keychain = require("./scripts/keychain");

// html head
var html_head = `<!DOCTYPE html>
<head>
<meta name="viewport" content="width=${config.device_width}" />
<link rel="stylesheet" href="local://assets/styles.css" />
<script src="local://3rdparty/html2canvas.js"></script>
<script src="local://3rdparty/canvas-dither.js"></script>
<script src="local://scripts/image_converter.js"></script>
</head>
<body>
<div id="capture" style='width: ${config.device_width}px; padding: 0 0 2px 0;'>
`;

var html_end = `</div>
</body>
</html>
`;

// Render UI
var converted_image = undefined;
$ui.render({
  props: {
    title: "Preview",
    navButtons: [
      {
        symbol: "person.circle",
        handler: () => {
          Config();
        }
      }
    ]
  },
  views: [
    {
      type: "button",
      props: {
        title: "Print"
      },
      layout(make, view) {
        make.top.left.right.inset(10);
        make.centerX.equalTo(view);
        make.height.equalTo(35);
      },
      events: {
        tapped(sender) {
          const memobirdID = keychain.get("memobirdID");
          const ak = keychain.get("ak");
          const useridentifying = keychain.get("useridentifying");
          if (!memobirdID || !ak || !useridentifying) {
            Config();
            return;
          }
          if (converted_image === undefined) {
            $ui.toast("Content is empty");
          } else {
            printer.printimage(converted_image);
          }
        }
      }
    },
    {
      type: "web",
      props: {
        id: "display",
        script: html_script
      },
      layout: function (make, view) {
        make.left.right.bottom.equalTo(view.super);
        make.top.equalTo($("button").bottom).offset(10);
      },
      events: {
        render: html_handler
      }
    }
  ]
});
$ui.loading(true);

// Convert input (txt or .bearnote) => html
GetInput().then(converted_html => {
  $file.delete(config.tmp_path);
  converted_html = html_head + converted_html + html_end;
  // $clipboard.text = converted_html;
  // Update web view
  $("display").html = converted_html;
});

// parse input
async function GetInput() {
  var data = $context.data;
  var welcome_page = converter.makeHtml($file.read("assets/welcome.md").string);
  if (!data) {
    $ui.toast("No file is shared.");
    return welcome_page;
  } else {
    let type = data.info.mimeType;
    if (type === "text/plain") {
      return converter.makeHtml(data.string);
    } else if (type === "application/zip") {
      let filename = data.fileName;
      let success = await $archiver.unzip({
        file: data,
        dest: config.tmp_path
      });
      if (!success) {
        $ui.alert("Unzip failed");
        return welcome_page;
      }
      let local_path = `${config.tmp_path}/${filename}`;
      let input_md = $file.read(`${local_path}/text.txt`).string;
      // convert image to base64
      const pat = /\[(assets\/[^\n\[\]]+)\]/g;
      function replacer(match, p1) {
        var img = $image(`${local_path}/${p1}`);
        if (
          img.size.width > config.max_img_width ||
          img.size.height > config.max_img_height
        ) {
          img = img.resized($size(config.max_img_width, config.max_img_height));
        }
        let base64_string =
          "data:image/png;base64," + fromByteArray(img.png.byteArray);
        return `![](${base64_string})`;
      }
      input_md = input_md.replace(pat, replacer);
      return converter.makeHtml(input_md);
    } else {
      $ui.toast(`Format ${type} is not supported.`);
      return welcome_page;
    }
  }
}

// Runs in the safari runtime
// Capture the rendered html and convert to 1-bit BMP
function html_script() {
  var option = {
    scale: 1,
    imageTimeout: 0
  };
  html2canvas(document.querySelector("#capture"), option).then(canvas => {
    var context = canvas.getContext("2d");
    let image = context.getImageData(0, 0, canvas.width, canvas.height);
    // dithering
    image = greyscale_luminance(image);
    dither_atkinson(image, canvas.width, false);
    context.putImageData(image, 0, 0);
    let parent = document.body.parentNode;
    parent.replaceChild(canvas, document.body);
    //document.body.appendChild(canvas);
    $notify("render", {
      image: To1BitBmp(image, canvas.width, canvas.height)
    });
  });
}

// Runs in JSBox environment
// Receives the BMP file string and convert to Base64 string
function html_handler(object) {
  let canvas_img = object.image;
  console.log(canvas_img.length);
  let bitmap = Uint8Array.from(
    { length: canvas_img.length },
    (element, index) => canvas_img.charCodeAt(index)
  );
  // DEBUG
  if (0) {
    const data = $data({
      byteArray: bitmap
    });
    $file.write({
      data: data,
      path: "assets/converted.bmp"
    });
  }
  converted_image = fromByteArray(bitmap);
  $ui.loading(false);
}
