#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var import_prompts = __toESM(require("../node_modules/prompts/index.js"));
var import_fs2 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var import_kolorist2 = require("../node_modules/kolorist/dist/cjs/index.js");

// src/functions.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var copyDir = (srcDir, destDir) => {
  import_fs.default.mkdirSync(destDir, { recursive: true });
  const prepareAndCopy = (file) => {
    const srcFile = import_path.default.resolve(srcDir, file);
    const destFile = import_path.default.resolve(destDir, file);
    copy(srcFile, destFile);
  };
  import_fs.default.readdirSync(srcDir).forEach(prepareAndCopy);
};
var write = (to, content) => import_fs.default.writeFileSync(to, content);
var copy = (src, dest) => import_fs.default.statSync(src).isDirectory() ? copyDir(src, dest) : import_fs.default.copyFileSync(src, dest);

// src/utils.ts
var import_path2 = __toESM(require("path"));

// src/constants.ts
var import_kolorist = require("../node_modules/kolorist/dist/cjs/index.js");
var TEMPLATES_DIRECTORY = `${__dirname}/../templates`;
var RENAMABLE_FILES_MAP = {
  _gitignore: ".gitignore"
};
var TEMPLATES = [
  {
    name: "react",
    color: import_kolorist.yellow,
    variants: [
      {
        color: import_kolorist.yellow,
        name: "react",
        display: "JavaScript"
      },
      {
        color: import_kolorist.blue,
        name: "react-ts",
        display: "TypeScript"
      }
    ]
  }
];

// src/utils.ts
var isValidPkgName = (name) => /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);
var getPkgManagerFromUserAgent = (userAgent) => {
  var _a;
  return (_a = userAgent == null ? void 0 : userAgent.split(" ")[0]) == null ? void 0 : _a.split("/")[0];
};
var isNotPackageJson = (name) => name !== "package.json";
var toValidPackageName = (name) => name.trim().toLowerCase().replace(/\s+/g, "-").replace(/^[._]/, "").replace(/[^a-z0-9-~]+/g, "-");
var installInstructionsByPkgManager = (pkgManager) => {
  var _a;
  const instructions = {
    yarn: `  yarn 
   yarn dev`,
    default: `  ${pkgManager} install 
  ${pkgManager} run dev`
  };
  return (_a = instructions[pkgManager]) != null ? _a : instructions.default;
};
var getTargetPath = (targetPath, fileName) => {
  var _a;
  return import_path2.default.join(targetPath, (_a = RENAMABLE_FILES_MAP[fileName]) != null ? _a : fileName);
};

// src/index.ts
var cwd = process.cwd();
var init = () => __async(exports, null, function* () {
  var _a;
  const state = {
    targetDir: ""
  };
  const templates = TEMPLATES.flatMap((f) => f.variants);
  let steps = [
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-awesome-project",
      onState: ({ value = "" }) => state.targetDir = value.trim()
    },
    {
      type: () => {
        if (import_fs2.default.existsSync(state.targetDir) ? "confirm" : null) {
          throw new Error("Target directory is not empty. Please try again.");
        }
        return null;
      },
      name: "exitInvalidDir"
    },
    {
      type: () => isValidPkgName(state.targetDir) ? null : "text",
      name: "packageName",
      message: (0, import_kolorist2.reset)("Package name:"),
      initial: () => toValidPackageName(state.targetDir),
      validate: (dir) => isValidPkgName(dir) || "Invalid package.json name"
    },
    {
      type: "select",
      name: "template",
      message: (0, import_kolorist2.reset)("Select a template:"),
      initial: 0,
      choices: templates.map((template) => ({
        title: template.color(template.name),
        value: template
      }))
    }
  ];
  const result = yield (0, import_prompts.default)(steps);
  const root = import_path3.default.join(cwd, state.targetDir);
  console.log(`
Scaffolding project in ${root}...`);
  import_fs2.default.mkdirSync(root);
  const templateDir = import_path3.default.join(TEMPLATES_DIRECTORY, result.template.name);
  import_fs2.default.readdirSync(templateDir).filter(isNotPackageJson).forEach((fileName) => copy(import_path3.default.join(templateDir, fileName), getTargetPath(root, fileName)));
  const packageJson = Object.assign(require(import_path3.default.join(templateDir, "package.json")), {
    name: result.packageName
  });
  write(getTargetPath(root, "package.json"), JSON.stringify(packageJson, null, 2));
  const pkgManager = (_a = getPkgManagerFromUserAgent(process.env.npm_config_user_agent)) != null ? _a : "npm";
  console.log((0, import_kolorist2.green)(`
Finished! Now run:
`));
  if (root !== cwd) {
    console.log(`  cd ${import_path3.default.relative(cwd, root)}`);
  }
  console.log(installInstructionsByPkgManager(pkgManager));
});
init().catch(({ message }) => console.error(message));
