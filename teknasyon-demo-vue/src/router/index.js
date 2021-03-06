import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import Register from "@/components/Register";
import UserList from "@/components/UserList";

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: "/",
      name: "UserList",
      component: UserList,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
  ],
});
