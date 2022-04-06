with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs-16_x
    nodePackages.typescript
    openjdk17
    maven
    deno
  ];
  shellHook = ''
    echo Welcome to the sqljson-query-example-pg project.
  '';
}
