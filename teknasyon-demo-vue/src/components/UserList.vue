<template>
<div>
   <h1>User List</h1> 

    <b-row>
			<b-col>	
				<span>Logged in As: {{currentUser.firstName}}</span>
			</b-col>
		</b-row>





</div>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";


export default {
  name: 'UserList',
  data: () => ({
    email: '',
    password: '',
		users: [],
		currentUser: {}
  }),
  created() {
    var vm = this
    
    let socket = io(process.env.VUE_APP_SERVER_URL);

    socket.on("login", (user) => {
      console.log(user);
			vm.$notify({
					type: 'success',
					text: user.firstName + ' Logged In!',
					duration: 10000,
			})
    });

    socket.on("register", (user) => {
      console.log(user);
			vm.$notify({
					type: 'success',
					text: user.firstName + ' Registered!',
					duration: 10000,
			})
    });


    axios.get(process.env.VUE_APP_SERVER_URL + '/user' )
        .then(
        (response) => {
            console.log(response.data)
						vm.currentUser = response.data
        },
        (response) => {
            console.log(response);
        }
        );

    axios.get(process.env.VUE_APP_SERVER_URL + '/users' )
        .then(
        (response) => {
            console.log(response.data)
						vm.users = response.data
        },
        (response) => {
            console.log(response);
        }
        );
  },
  methods: {
		goToRegister() {
			this.$router.push({path: '/register'})
		}
  }
}
</script>

<style>

</style>