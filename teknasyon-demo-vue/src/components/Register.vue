<template>
<div>
   <h1>Register</h1> 

    <b-row>
        <form>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="firstName" type="text" 
                        placeholder="First Name" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="lastName" type="text" 
                        placeholder="Last Name" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="email" type="text" 
                        placeholder="Email" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="password" type="password" 
                        placeholder="Password" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="passwordRepeat" type="password" 
                        placeholder="Password Repeat" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="language" type="text" 
                        placeholder="Language" />
                </b-form-group>
            </b-col>
            <b-col cols="6" class="offset-3 mb-2">
                <b-form-group>
                    <b-input v-model="country" type="text" 
                        placeholder="Country" />
                </b-form-group>
            </b-col>
    
        <button type="button" 
                @click="registerUser" class="btn btn-outline-success register mt-2 mr-2">Register</button>
        </form>
    </b-row>

        <button type="button" 
                @click="goToLogin" class="btn btn-outline-info login mt-2 ml-2">Login</button>



</div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Register',
  data: () => ({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    language: '',
    country: ''
  }),
  created() {

  },
  methods: {
    registerUser() {
      var vm = this
      var regularExpression = /^[a-zA-Z0-9]+$/;
      var isValid = regularExpression.test(vm.password)

      if (vm.firstName.length < 1) {
        vm.$notify({
            type: 'warn',
            text: 'First Name Cant Be Empty!',
            duration: 10000,
        })
      }
      else if (vm.lastName.length < 1) {
        vm.$notify({
            type: 'warn',
            text: 'Last Name Cant Be Empty!',
            duration: 10000,
        })
      }
      else if( vm.password !== vm.passwordRepeat) {
        vm.$notify({
            type: 'warn',
            text: 'Passwords should match!',
            duration: 10000,
        })
      }
      else if (vm.password.length < 8) {
        vm.$notify({
            type: 'warn',
            text: 'Passwords should be atleast 8 chars!',
            duration: 10000,
        })
      }
      else if (!isValid) {
        vm.$notify({
            type: 'warn',
            text: 'Passwords should contain only letters and numbers!',
            duration: 10000,
        })

      } else {
          let data = {
              firstName: vm.firstName,
              lastName: vm.lastName,
              email: vm.email,
              password: vm.password,
              language: vm.language,
              country: vm.country
          }
          axios.post(process.env.VUE_APP_SERVER_URL + '/create_new_user', {data})
              .then(
                (response) => {
                  console.log(response.data)
                  if (response.data == "success") {
                    vm.$notify({
                        type: 'success',
                        text: 'New User Registered Successfully!!',
                        duration: 10000,
                    });
                  }
                },
                (response) => {
                  console.log(response);
                }
              );
      }
    },
		goToLogin() {
			this.$router.push({ path: '/' })
		}
  }
}
</script>

<style>	

.register .login {
	display: inline-block;
}

</style>