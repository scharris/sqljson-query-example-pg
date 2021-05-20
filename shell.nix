with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs
    nodePackages.typescript
  ];
  shellHook = ''
    echo Welcome to the sqljson-query-example-pg project.
  '';
}
