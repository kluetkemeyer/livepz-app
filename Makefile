SHELL				= bash
SOURCE_JS			= $(shell find src/js -name "*.js")

SOURCE_TPLS_SOY		= $(shell find src/templates -name "*.soy")
SOURCE_TPLS_JS		= $(SOURCE_TPLS_SOY:%.soy=%.soy.js)

.PHONY:				all dev dist test buildTemplates buildJavascript buildDepsFile

all:				buildDepsFile buildJavascript

dev:				buildDepsFile

dist:				buildJavascript

test:
	echo $(SOURCE_TPLS_JS)
	
buildTemplates:		$(SOURCE_TPLS_JS)

buildJavascript:	buildTemplates js/app.min.js

buildDepsFile:		buildTemplates js/deps.js

js/app.min.js:		$(SOURCE_JS)
	bin/closure-library/closure/bin/build/closurebuilder.py \
		--root=bin/closure-library/ \
		--root=src/js/ \
		--root=src/templates/ \
		--namespace="tt.app" \
		--output_mode=compiled \
		--compiler_jar=bin/closure-compiler/compiler.jar \
		--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
		> js/app.min.js
		
js/deps.js:			$(SOURCE_JS)
	bin/closure-library/closure/bin/build/depswriter.py \
		--root_with_prefix="src/js ../../../../src/js" \
		--root_with_prefix="src/templates ../../../../src/templates" \
		> js/deps.js
	
%.soy.js:			%.soy
	java -jar bin/closure-template/SoyToJsSrcCompiler.jar \
		--allowExternalCalls false \
		--shouldGenerateJsdoc true \
		--shouldProvideRequireSoyNamespaces true \
		--outputPathFormat $@ --srcs $^
