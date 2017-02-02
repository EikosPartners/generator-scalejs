# ScaleJS Generator
> A Yeoman generator for scalejs, a robust JavaScript framework for building versatile web and mobile applications in Visual Studio.

[ScaleJS Documentation](https://eikospartners.github.io/scalejs)

## Usage
Install `yo` and the generator package `generator-scalejs`.

```npm
install -g yo generator-scalejs
```

Make a new directory and cd into it.

```
mkdir myproject && cd myproject
```

Run the generator

```
yo scalejs
```

The generator gives you the option of creating a package.json during the process as well as choosing any additional services you would like installed. You can install these services at a later time if desired using the sub generator commands.

## Available Sub-generators
* [profile](#profile)
* [dataservice](#dataservice)
* [font_icon](#font_icon)


### Profile
Generates the files necessary to implement profile services within saclejs.
```
yo scalejs:profile
```

### Dataservice
Generates the files necessary for a custom dataservice.
```
yo scalejs:dataservice
```

### Font_Icon
Generates the files necessary for font icons.
```
yo scalejs:font_icon
```
