(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[8],{222:function(e,a,t){"use strict";t.r(a);var n=t(70),r=t(20),i=t(159),o=t(0),l=t.n(o),c=t(227),s=t(151),m=t(223),u=t(224),h=t(69),d=t(72),b=t(149),g=t(25),p=t(29),v=Object(b.a)((function(e){return{Login:{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",height:"100vh",width:"100vw"},LoginForm:"\n    max-width: 300px;\n  "}}));a.default=function(e){var a=e.history,t=e.location,b=v(),f=Object(p.e)(),E=/\/registration/.test(t.pathname),j=Object(o.useState)({}),O=Object(i.a)(j,2),w=O[0],x=O[1],y=Object(o.useState)({}),L=Object(i.a)(y,2),C=L[0],J=L[1],W=function(e){var t=e.data;E?(alert("Check your email"),a.push("/login")):(f(Object(p.b)({})),g.a.set(t.login),a.push("/me")),J({})},k=function(e){e.graphQLErrors&&e.graphQLErrors.forEach((function(e){return J(e.extensions.validationErrors)}))},N=Object(h.u)(),S=Object(i.a)(N,1)[0],T=Object(h.r)(),B=Object(i.a)(T,1)[0],D=function(e){var a=e.target,t=a.name,i=a.value;x((function(e){return Object(r.a)({},e,Object(n.a)({},t,i))}))};return l.a.createElement("div",{className:b.Login},l.a.createElement("div",{className:b.LoginForm},l.a.createElement(s.a,{variant:"h6",gutterBottom:!0},E?"Join":"Login"),l.a.createElement("form",{onSubmit:function(e){e.preventDefault(),E?S({variables:w}).then(W).catch(k):B({variables:w}).then(W).catch(k)}},l.a.createElement("div",null,l.a.createElement(c.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:D,value:w.username,label:"Username",name:"username",error:C.username,helperText:C.username}),E&&l.a.createElement(c.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:D,value:w.email,label:"Email",name:"email",error:C.email,helperText:C.email}),l.a.createElement(c.a,{fullWidth:!0,margin:"dense",variant:"outlined",onChange:D,value:w.password,label:"Password",name:"password",type:"password",error:C.password,helperText:C.password})),l.a.createElement(s.a,{align:"center",variant:"body2",gutterBottom:!0},l.a.createElement(m.a,{align:"center",component:d.b,to:E?"/login":"/registration"},E?"Already have an account":"Not a member")),l.a.createElement(u.a,{type:"submit",fullWidth:!0},E?"Join":"Login"))))}}}]);