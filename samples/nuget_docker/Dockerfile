FROM mono:3.12.0-onbuild
RUN ["mono", "/usr/src/app/source/packages/NUnit.Runners.2.6.4/tools/nunit-console.exe", "nugetdockerlib.dll", "-nologo"]
ENTRYPOINT ["mono", "nugetdocker.exe"]
