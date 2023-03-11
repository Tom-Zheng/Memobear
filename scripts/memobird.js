const keychain = require("./keychain");

function GetApiUrl(cmd) {
  var base = "https://open.memobird.cn/home/";
  return base + cmd;
}

function JsonToURL(input) {
  var output = "";
  for (key in input) {
    if (output.length > 0) {
      output += "&";
    }
    output =
      output +
      $text.URLEncode(String(key)) +
      "=" +
      $text.URLEncode(String(input[key]));
  }
  return output;
}

const GetPrinter = function () {
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  const Printer = {
    userBind() {
      return new Promise((resolve, reject) => {
        let cached_userid = $cache.get("userId");
        if (cached_userid) {
          console.log("cache hit");
          resolve(cached_userid);
        } else {
          $http.post({
            url: GetApiUrl("setuserbind"),
            header: headers,
            body: JsonToURL({
              memobirdID: keychain.get("memobirdID"),
              ak: keychain.get("ak"),
              useridentifying: keychain.get("useridentifying")
            }),
            handler: function (resp) {
              const data = resp.data;
              if (data["showapi_res_code"] != 1) {
                $ui.alert({
                  title: "userBind Error",
                  message: data["showapi_res_error"]
                });
                $cache.clear();
                reject();
              } else {
                let userId = data["showapi_userid"];
                $cache.set("userId", userId);
                resolve(userId);
              }
            }
          });
        }
      });
    },
    printimage(data) {
      this.userBind().then(userid => {
        $http.post({
          // printpaper
          url: GetApiUrl("printpaper"),
          header: headers,
          body: JsonToURL({
            ak: keychain.get("ak"),
            printcontent: "P:" + data,
            memobirdID: keychain.get("memobirdID"),
            userId: userid
          }),
          handler: function (resp) {
            const data = resp.data;
            if (data["showapi_res_code"] != 1) {
              $ui.alert({
                title: "printpaper Error",
                message: data["showapi_res_error"]
              });
              $cache.clear();
            } else {
              $ui.alert("Success!");
            }
          }
        });
      });
    }
  };

  return Printer;
};

module.exports = {
  GetPrinter: GetPrinter
};
