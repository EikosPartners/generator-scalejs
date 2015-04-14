
define ['scalejs!core', 'scalejs!application'], ({<%=ext_name%>}) ->

    # For deeper testing, pass to the console

    console.log 'core.<%=ext_name%>: ', <%=ext_name%>

    describe 'core.<%=ext_name%>', () ->

        it 'is defined', () ->

            expect(<%=ext_name%>).toBeDefined()

