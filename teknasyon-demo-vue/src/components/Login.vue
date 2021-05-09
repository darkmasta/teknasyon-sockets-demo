<template>
<div>
   <h1>Login</h1> 

    <b-row>
        <form>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="email" type="text" 
                        placeholder="Email" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3">
                <b-form-group>
                    <b-input v-model="password" type="password" 
                        placeholder="Password" />
                </b-form-group>
            </b-col>
            <button type="button" @click="loginUser(email, password)" class="btn btn-outline-success mt-2">Login</button>
        </form>
    </b-row>

    <b-row>
        <b-col cols="6" class="offset-3">
            <button type="button" @click="goToRegister" class="btn btn-outline-info mt-2">Register</button>
        </b-col>
    </b-row>
    



</div>
</template>

<script>
import axios from 'axios'
import qs from "querystring";


export default {
  name: 'Login',
  data: () => ({
      email: '',
      password: ''
  }),
  methods: {
		loginUser: function (email, password) {
      const requestBody = {
        username: email,
        password: password,
      };

      console.log(requestBody);

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      var vm = this;
      axios
        .post(
          process.env.VUE_APP_SERVER_URL + "/login/local",
          qs.stringify(requestBody),
          config
        )
        .then(
          (response) => {
            // var userData = response.data;
            console.log(response.data);
            if (response.data == "Error signing in") {
              console.log(response);
              vm.errors = true;
              vm.$notify({
                  type: 'error',
                  text: 'Login Fail!'
              })
              vm.errorMessage = "Error logging in";
            } else if (response.data == "success") {
              vm.$notify({
                  type: 'success',
                  text: 'Login Success!'
              })
              setTimeout(() => {this.$router.push({ path: "/" })}, 1000);
            }
          },
          (response) => {
            console.log(response);
          }
        );
    },
		goToRegister() {
			this.$router.push({path: '/register'})
		}
  }
}
</script>

<style>
.login {
    background: #ccc;
}

</style>