let todo = content =>
  `<ul class='todo-list'><li><span class='todo-checkbox '><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg>
</span><span class='todo-text'> ${content}</span>
</li></ul>`;

let done = content =>
  `<ul class='todo-list'><li><span class='todo-checkbox todo-checked'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591zm-5.041-15c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg>
</span><span class='todo-text'> ${content}</span>
</li></ul>
`;

let bear = function bear(showdown) {
  showdown.extension("polar-bear", () => {
    return [
      // strikethrough
      {
        type: "lang",
        regex: /(~~)([^~\n]+[^\s])(~~)/gm,
        replace: "<del>$2</del>"
      },
      // underline
      {
        type: "lang",
        regex: /([~])([^~\n]+[^\s])([~])/gm,
        replace: `<span class="underline">$2</span>`
      },
      // mark
      {
        type: "lang",
        regex: /(::)([^:\n]+[^\s])(::)/gm,
        replace(match, prefix, content) {
          return `<span class="highlight">${content}</span>`;
        }
      },
      // flanked hashtag
      {
        type: "lang",
        regex: /(#)([^#\n\s\)]+)(#)/gm,
        replace(match, prefix, content) {
          return `<span class="hashtag">${content}</span>`;
        }
      },
      // hashtag
      {
        type: "lang",
        regex: /(#){1}([^#\n\s\)]+)(?:\s|$)/gm,
        replace(match, prefix, content) {
          return `<span class="hashtag">${content}</span>`;
        }
      },
      // todo
      {
        type: "lang",
        regex: /(- )\[[ ]?\]([^\n]*)/gm,
        replace(match, prefix, content) {
          console.log(content);
          return todo(content);
        }
      },
      // done
      {
        type: "lang",
        regex: /(- )\[[^\n ]\]([^\n]*)/gm,
        replace(match, prefix, content) {
          return done(content);
        }
      },
      // hr
      {
        type: "lang",
        regex: /(^---$)/gm,
        replace: () => "<hr>"
      },
      // link
      {
        type: "lang",
        regex: /(\[\[)([^\n]+?)(\]\])/gm,
        replace: `<span class="link">$2</span>`
      },
    ];
  });
};

module.exports = { bear };

// {
// 	let showdown = require("showdown")
// 	bear(showdown)

// 	let md = new showdown.Converter()

// 	md.useExtension("polar-bear")

// 	console.log(md.makeHtml(`
// # abebananachee 👦🍌👧
// /serves 1 abe 👦 and 1 chee 👧/

// ## ingredients
// ### the banana 🍌
// * a banana 🍌
// ### the ice cream 🍨
// * 3 scoops 🥄 Neapolitan ice cream 🍨 (1 scoop 🥄 each flavour)
// ### the toppings
// #### sweet nut 🥜
// * a handful of peanuts 🥜
// * a stick of Kerrygold™©® butter
// * 50ml honey 🍯 (preferably w/ a hint of cinnamon)
// #### chocolate 🍫 sauce
// * 20g chocolate 🍫
// * 15ml milk 🥛
// * 15ml cream

// ---

// ## directions
// 1. ::Slice:: the banana 🍌 a single /longways/ _cute_ with the blade of a handleless knife and put it in the bowl 🥣. You only own one bowl 🥣, so use that one.
// 2. Scoop a scoop 🥄 of choco 🍫, a scoop 🥄 of vanillum and a scoop 🥄 of strawberring 🍓 into the split of banana 🍌
// 3. To a -hot pot- add the butter, the honey 🍯 and the peanuts 🥜 and cook them til the honey 🍯 cronch
// 4. Sprinkle the nuts 🥜 atop the ice cream 🍨 and banana 🍌
// 5. Melt the chocolate 🍫 and milk 🥛 and cream together, then pour over the nuts 🥜
// 6. Yim yim yim, zip zip zip: *eat*.

// - todo
// - gotta run fast
// + gotta be done

// #special kind of hashtag#

// #recipe #recipe/banana
// 	`))
// }
