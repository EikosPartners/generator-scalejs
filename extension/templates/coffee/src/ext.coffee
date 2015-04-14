
define ['scalejs!core'], (core) ->

    # There are few ways you can register an extension.
    # 1. Core and Sandbox are extended in the same way:
    #      core.registerExtension part1: part1
    #
    # 2. Core and Sandbox are extended differently:
    #      core.registerExtension
    #          core:
    #              corePart: corePart
    #          sandbox:
    #              sandboxPart: sandboxPart
    #
    # 3. Core and Sandbox are extended dynamically:
    #      core.registerExtension
    #          buildCore: buildCore
    #          buildSandbox: buildSandbox
    #
    core.registerExtension
        <%= ext_jsname %>: { }

