angular.module("reCaptchaDemo", [])
    .controller("AppCtrl", function ($scope, $http) {
        $scope.auth = {};
        $scope.sendForm = function (auth) {
            $http({
                method: "POST",
                url: "/register",
                data: $.param(auth),
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            }).then(
                function (data) {
                    window.alert("Успешно зарегистрирован!");
                },
                function (error) {
                    window.alert("При регистрации произошла ошибка");
                })
        }
    })
.directive("recaptcha",function () {
    return{
        require:"ngModel",
        restrict:"E",
        scope:{
            sitekey:"@",
            ngModel:"="
        },
        link:function (scope,element,attrs,ngModelCtrl) {
            var reCaptcha=document.createElement("script");
            reCaptcha.type="text/javascript";
            reCaptcha.async=true;
            window.onloadReCaptchCallback=function () {
                grecaptcha.render(element.get(0),{
                    "sitekey":scope.sitekey,
                    "callback":onReCaptchaSubmit,
                    "expired-callback":onReCaptchaExpired
                });
            };
            reCaptcha.src="https://www.google.com/recaptcha/api.js?onload=onloadReCaptchCallback&render=explicit";
            var firstscript=document.getElementsByTagName("script")[0];
            firstscript.parentNode.insertBefore(reCaptcha,firstscript);


            window.onReCaptchaSubmit=function (gReCaptchaResponse) {
                scope.ngModel=gReCaptchaResponse;
                ngModelCtrl.$setViewValue(gReCaptchaResponse)
            };
            window.onReCaptchaExpired=function () {
                scope.ngModel="";
                ngModelCtrl.$setViewValue("")
            };
            ngModelCtrl.$validators.recaptchaValidate=function (modelValue,viewValue) {
                return !ngModelCtrl.$isEmpty(scope.ngModel);
            }
        }
    }
})