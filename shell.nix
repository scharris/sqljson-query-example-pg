with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs
    nodePackages.typescript
    openjdk11
    maven
  ];
  shellHook = ''
    echo Welcome to the sqljson-query-example-pg project.
  '';
}
