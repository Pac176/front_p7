module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		commonjs: true
    
	},
	extends: ["plugin:vue/essential", "eslint:recommended"],
	parserOptions: {
		parser: "babel-eslint",
		ecmaVersion: 2020,
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		semi: ["error", "always", { omitLastInOneLineBlock: true }],
		"no-useless-escape": ["off"],
		indent: ["error", "tab"],
	},
};
