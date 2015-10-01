
define([
    '<%= name %>ViewModel',
    'chai',
    'scalejs!core',
    'scalejs.sandbox',
    'scalejs.reactive',
    'scalejs!application'
], function (<%= name %>ViewModel, chai, core, sandbox) {
	var expect = chai.expect;
	
	
	describe( '<%= name %>ViewModel test', function(){
		
		it('VM exists', function(done){
			var vm = <%= name %>ViewModel();
			expect(vm).not.equal(undefined);
			done();
		});
	});	
});

