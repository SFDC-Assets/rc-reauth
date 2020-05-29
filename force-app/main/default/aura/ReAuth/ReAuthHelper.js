({

    checkAuth: function(component) {

        var recordId = component.get("v.recordId");
        var password = component.get("v.password");
        console.log('ReAuthHelper > checkAuth - recordId: ' + recordId + ', password: ' + password);

        // Create the action
        var doAction = true;
        var action = component.get("c.checkCredentials"); // method on the ReAuthController
        if (recordId != null) {
            action.setParams({
                "recordId": recordId,
                "password": password
            });
        }
        else {
            action.setParams({
                "password": password
            });
        }

        if (doAction) {

            // Add callback behavior for when response is received
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('ReAuthHelper > checkAuth - response state: ' + state)

                if (state === "SUCCESS") {

                    var reAuthResponse = response.getReturnValue();
                    console.log('ReAuthHelper > checkAuth - reAuthResponse: ' + JSON.stringify(reAuthResponse));

                    if (reAuthResponse.authPassed) {
                        component.set("v.authPassed", true);
                        component.set("v.errorMessage", '');
                    } else {
                        component.set("v.authPassed", false);
                        component.set("v.errorMessage", reAuthResponse.errorMessage);
                    }

                } else {
                    console.log("ReAuthHelper > checkAuth - failed with state: " + state);
                    component.set("v.authPassed", false);
                    component.set("v.authError", "Error calling auth service: " + state);
                }
            });

            // Send action off to be executed
            $A.enqueueAction(action);

        } // end doAction

    }, // end checkAuth

});