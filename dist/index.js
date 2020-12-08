function e(e){if(e&&e.__esModule)return e;var t={};return e&&Object.keys(e).forEach(function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}),t.default=e,t}var t,n=require("react"),r=(t=n)&&"object"==typeof t&&"default"in t?t.default:t,i=require("@xstate/react"),o=require("date-fns"),a=require("xstate"),u=require("xstate/lib/actions");function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var c=a.Machine({id:"useAuth",initial:"unauthenticated",context:{user:{},expiresAt:null,authResult:null,isAuthenticating:!1,error:void 0,errorType:void 0,config:{navigate:function(){return console.error("Please specify a navigation method that works with your router")},callbackDomain:"http://localhost:8000"}},states:{unauthenticated:{on:{LOGIN:"authenticating",CHECK_SESSION:"verifying",SET_CONFIG:{actions:["setConfig"]}}},authenticating:{on:{ERROR:"error",AUTHENTICATED:"authenticated",SET_CONFIG:{actions:["setConfig"]}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},verifying:{invoke:{id:"checkSession",src:function(e,t){return e.config.authProvider.checkSession()},onDone:{target:"authenticated"},onError:{target:"unauthenticated",actions:["clearUserFromContext","clearLocalStorage"]}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},authenticated:{on:{LOGOUT:"unauthenticated",SET_CONFIG:{actions:["setConfig"]},CHECK_SESSION:"verifying"},entry:["saveUserToContext","saveToLocalStorage"],exit:u.choose([{cond:function(e,t){return"CHECK_SESSION"!==t.type},actions:["clearUserFromContext","clearLocalStorage"]}])},error:{entry:["saveErrorToContext","clearUserFromContext","clearLocalStorage"]}}},{actions:{startAuthenticating:a.assign(function(e){return{isAuthenticating:!0}}),stopAuthenticating:a.assign(function(e){return{isAuthenticating:!1}}),saveUserToContext:a.assign(function(e,t){var n=t.data?t.data:t,r=n.authResult;return{user:n.user,authResult:r,expiresAt:o.addSeconds(new Date,r.expiresIn)}}),clearUserFromContext:a.assign(function(e){return{user:{},expiresAt:null,authResult:null}}),saveToLocalStorage:function(e,t){var n=e.expiresAt,r=e.user;"undefined"!=typeof localStorage&&(localStorage.setItem("useAuth:expires_at",n?n.toISOString():"0"),localStorage.setItem("useAuth:user",JSON.stringify(r)))},clearLocalStorage:function(){"undefined"!=typeof localStorage&&(localStorage.removeItem("useAuth:expires_at"),localStorage.removeItem("useAuth:user"))},saveErrorToContext:a.assign(function(e,t){return{errorType:t.errorType,error:t.error}}),setConfig:a.assign(function(e,t){return{config:s({},e.config,t)}})}}),l=a.interpret(c);l.start(),function(e){if("undefined"!=typeof localStorage){var t=new Date(localStorage.getItem("useAuth:expires_at")||"0"),n=new Date;if(o.isAfter(t,n)){var r=JSON.parse(localStorage.getItem("useAuth:user")||"{}");e("LOGIN"),e("AUTHENTICATED",{user:r,authResult:{expiresIn:o.differenceInSeconds(t,n)}})}}}(l.send);var h=function(){var e=i.useService(l),t=e[0],r=e[1],a=t.context.config,u=a.authProvider,s=a.navigate,c=a.callbackDomain,h=n.useCallback(function(e){var t=(void 0===e?{}:e).postLoginRoute,n=void 0===t?"/":t;try{if(!u||!s)return console.warn("authProvider not configured yet"),Promise.resolve();var i=function(){if("undefined"!=typeof window)return r("LOGIN"),Promise.resolve(u.handleLoginCallback(r)).then(function(e){e&&s(n)})}();return Promise.resolve(i&&i.then?i.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},[u,s]),f=function(){return!(!t.context.expiresAt||!o.isAfter(t.context.expiresAt,new Date))};return{isAuthenticating:t.context.isAuthenticating,isAuthenticated:f,isAuthorized:function(e){var n=Array.isArray(e)?e:[e],r=null==u?void 0:u.userRoles(t.context.user);return!(!f()||!r)&&n.some(function(e){return r.includes(e)})},user:t.context.user,userId:null==u?void 0:u.userId(t.context.user),authResult:t.context.authResult,login:function(){null==u||u.authorize()},signup:function(){null==u||u.signup()},logout:function(e){"string"==typeof e?null==u||u.logout(""+c+e):null==u||u.logout(),r("LOGOUT"),s("string"==typeof e?e:"/")},handleAuthentication:h,dispatch:r}};function f(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}var d=function(){function t(t){var n=this;this.dispatch=t.dispatch,this.customPropertyNamespace=t.customPropertyNamespace,new Promise(function(t){t(e(require("auth0-js")))}).then(function(e){n.auth0=new(0,e.default)(s({},t))})}t.addDefaultParams=function(e,t){return s({redirectUri:t+"/auth0_callback",audience:"https://"+e.domain+"/api/v2/",responseType:"token id_token",scope:"openid profile email"},e)};var n=t.prototype;return n.authorize=function(){var e;null==(e=this.auth0)||e.authorize()},n.signup=function(){var e;null==(e=this.auth0)||e.authorize({mode:"signUp",screen_hint:"signup"})},n.logout=function(e){var t;null==(t=this.auth0)||t.logout({returnTo:e})},n.userId=function(e){return e.sub},n.userRoles=function(e){var t=e[(this.customPropertyNamespace+"/user_metadata").replace(/\/+user_metadata/,"/user_metadata")];return(null==t?void 0:t.roles)||null},n.handleLoginCallback=function(){try{var e=this;return Promise.resolve(new Promise(function(t,n){var r;null==(r=e.auth0)||r.parseHash(function(n,r){try{n&&(e.dispatch("ERROR",{error:n,errorType:"authResult"}),t(!1));var i=f(function(){return Promise.resolve(e.handleAuthResult(r)).then(function(e){t(e)})},function(n){e.dispatch("ERROR",{error:n,errorType:"handleAuth"}),t(!1)});return Promise.resolve(i&&i.then?i.then(function(){}):void 0)}catch(e){return Promise.reject(e)}})}))}catch(e){return Promise.reject(e)}},n.checkSession=function(){try{var e=this;return Promise.resolve(new Promise(function(t,n){var r;null==(r=e.auth0)||r.checkSession({},function(r,i){try{var o=function(){if(!r&&i&&i.accessToken&&i.idToken){var o=f(function(){return Promise.resolve(e.fetchUser(i)).then(function(e){t({user:e,authResult:i})})},function(e){n(e)});if(o&&o.then)return o.then(function(){})}else n(r||new Error("Session invalid"))}();return Promise.resolve(o&&o.then?o.then(function(){}):void 0)}catch(e){return Promise.reject(e)}})}))}catch(e){return Promise.reject(e)}},n.handleAuthResult=function(e){try{var t=this;return e&&e.accessToken&&e.idToken?Promise.resolve(t.fetchUser(e)).then(function(n){return t.dispatch("AUTHENTICATED",{authResult:e,user:n}),!0}):Promise.resolve(!1)}catch(e){return Promise.reject(e)}},n.fetchUser=function(e){try{var t=this;return Promise.resolve(new Promise(function(n,r){var i;null==(i=t.auth0)||i.client.userInfo((null==e?void 0:e.accessToken)||"",function(e,t){e?r(e):n(t)})}))}catch(e){return Promise.reject(e)}},t}(),p={__proto__:null,Auth0:d,NetlifyIdentity:function(){function t(t){var n=this;this.dispatch=t.dispatch,new Promise(function(t){t(e(require("netlify-identity-widget")))}).then(function(e){n.netlifyIdentity=e.default,n.netlifyIdentity.init(t),n.netlifyIdentity.on("error",function(e){n.dispatch("ERROR",{error:e,errorType:"netlifyError"})}),n.netlifyIdentity.on("login",function(e){var t;n.dispatch("AUTHENTICATED",{user:e,authResult:{expiresIn:null==(t=e.token)?void 0:t.expires_in}})}),n.netlifyIdentity.on("init",function(e){var t;console.log("INIT",e),e&&(n.dispatch("LOGIN"),n.dispatch("AUTHENTICATED",{user:e,authResult:{expiresIn:null==(t=e.token)?void 0:t.expires_in}}))})})}t.addDefaultParams=function(e,t){return void 0===e&&(e={}),e};var n=t.prototype;return n.authorize=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("login")},n.signup=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("signup")},n.logout=function(e){this.netlifyIdentity.logout()},n.handleLoginCallback=function(e){try{return console.warn("handleLoginCallback is unnecessary with Netlify Identity Widget"),Promise.resolve(!0)}catch(e){return Promise.reject(e)}},n.checkSession=function(){try{var e=this,t=function(t){var n,r=e.netlifyIdentity.currentUser();if(r)return{user:r,authResult:{expiresIn:null==(n=r.token)?void 0:n.expires_in}};throw new Error("Session invalid")},n=function(t,n){try{var r=Promise.resolve(e.netlifyIdentity.refresh()).then(function(){})}catch(e){return n()}return r&&r.then?r.then(void 0,n):r}(0,function(){throw new Error("Session invalid")});return Promise.resolve(n&&n.then?n.then(t):t())}catch(e){return Promise.reject(e)}},n.userId=function(e){return e.id},n.userRoles=function(e){return[e.role]||null},t}()};exports.AuthConfig=function(e){var t=e.authProvider,r=e.params,i=e.navigate,o=e.children,a=h().dispatch,u="undefined"!=typeof window?window.location.protocol+"//"+window.location.host:"http://localhost:8000";return n.useEffect(function(){var e=new t(s({dispatch:a},t.addDefaultParams(r,u)));a("SET_CONFIG",{authProvider:e,navigate:i,callbackDomain:u}),a("CHECK_SESSION")},[a,t,r,i]),n.createElement(n.Fragment,null,o)},exports.AuthProvider=function(e){var t=e.children,i=e.navigate,o=e.auth0_domain,a=e.auth0_params,u=void 0===a?{}:a,c=e.customPropertyNamespace,l={domain:o,clientID:e.auth0_client_id,redirectUri:("undefined"!=typeof window?window.location.protocol+"//"+window.location.host:"http://localhost:8000")+"/auth0_callback",audience:"https://"+(e.auth0_audience_domain||o)+"/api/v2/",responseType:"token id_token",scope:"openid profile email"},f=h().dispatch;return n.useEffect(function(){var e=new d(s({dispatch:f,customPropertyNamespace:c},l,u));f("SET_CONFIG",{authProvider:e,navigate:i}),f("CHECK_SESSION")},[i,c]),n.useEffect(function(){console.warn("Using the AuthProvider root component is deprecated. Migrate to AuthConfig or manual dispatching. Takes  5min.")},[]),r.createElement(r.Fragment,null,t)},exports.Providers=p,exports.useAuth=h;
//# sourceMappingURL=index.js.map
