const keychain = require("./keychain");

module.exports = () => {
  $ui.push({
    props: {
      title: "Config",
      navButtons: [
        {
          // Changes take place here
          symbol: "checkmark.circle",
          handler: () => {
            const memobirdID = $("memobirdid-label").text;
            const ak = $("ak-label").text;
            const useridentifying = $("useridentifying-label").text;

            if (
              memobirdID.length == 0 ||
              ak.length == 0 ||
              useridentifying == 0
            ) {
              $ui.toast("Please provide correct values");
              return;
            }
            $cache.clear();
            keychain.set("memobirdID", memobirdID);
            keychain.set("ak", ak);
            keychain.set("useridentifying", useridentifying);
            $ui.pop();
          }
        },
        {
          // Changes take place here
          symbol: "clear",
          handler: () => {
            $cache.clear();
            keychain.clear();
            $ui.pop();
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              title: "memobirdID",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "memobirdid-label",
                    type: $kbType.ascii,
                    placeholder: "memobirdID",
                    text: keychain.get("memobirdID")
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  },
                  events: {
                    ready: sender => {
                      $delay(0.5, () => {
                        sender.focus();
                      });
                    }
                  }
                }
              ]
            },
            {
              title: "ak",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "ak-label",
                    type: $kbType.ascii,
                    placeholder: "ak",
                    text: keychain.get("ak")
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  }
                }
              ]
            },
            {
              title: "useridentifying",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "useridentifying-label",
                    type: $kbType.ascii,
                    placeholder: "useridentifying",
                    text: keychain.get("useridentifying")
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  }
                }
              ]
            }
          ]
        },
        layout: $layout.fill
      }
    ]
  });
};
