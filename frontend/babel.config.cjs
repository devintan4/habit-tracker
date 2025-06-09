module.exports = {
  presets: [
    // Target node agar Jest jalan
    ["@babel/preset-env", { targets: { node: "current" } }],
    // JSX automatic runtime (tidak perlu import React)
    ["@babel/preset-react", { runtime: "automatic" }],
    // TypeScript
    "@babel/preset-typescript",
  ],
  plugins: [
    // Plugin untuk transform import.meta.env.X → process.env.X
    function babelPluginImportMetaEnv({ types: t }) {
      return {
        visitor: {
          MemberExpression(path) {
            const { node } = path;
            // Cek pola import.meta.env.FOO
            if (
              t.isMemberExpression(node.object) &&
              t.isMetaProperty(node.object.object) &&
              node.object.object.meta.name === "import" &&
              node.object.object.property.name === "meta" &&
              t.isIdentifier(node.object.property, { name: "env" }) &&
              t.isIdentifier(node.property)
            ) {
              // Ambil nama property terakhir (FOO)
              const envName = node.property.name;
              // Ganti dengan process.env.FOO
              path.replaceWith(
                t.memberExpression(
                  t.memberExpression(
                    t.identifier("process"),
                    t.identifier("env")
                  ),
                  t.identifier(envName),
                  false
                )
              );
            }
          },
        },
      };
    },
  ],
};
