define([
    'scalejs!core', 'scalejs!application'
], function(
    core
) {
    var <%=ext_jsname%> = core.<%=ext_jsname%>;

    // For deeper testing, log to console
    console.log('core.<%=ext_jsname%>: ', <%=ext_jsname%>);

    describe('core.<%=ext_jsname%>', function() {

        it('is defined', function() {
            expect(<%=ext_jsname%>).toBeDefined();
        });

    });
});

