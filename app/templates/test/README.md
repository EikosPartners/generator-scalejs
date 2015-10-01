Running Code Coverage on Scalejs 

    1) Ensure you have karma-cli installed globally by running 
        'npm install -g karma-cli'
        
    2) From a command line run 'npm test'
        -This will generate the RefDataEditor/coverage directory and populate 
         the coverage report
         
    3) Open 'RefDataEditor/coverage/PhantomJS 1.9.8 (Linux 0.0.0)/index.html' in 
        your web browser to view the report

Running Karma testing with auto-watch is useful when developing to ensure no 
functionality is being compromised

To run this simply run 'npm run test-watch' and karma will stay running while you 
develop and will auto-run the tests whenever a file changes.
