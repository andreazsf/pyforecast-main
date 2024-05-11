<template>
  <q-card flat class="q-ma-xl">
    <div class="col flex">
      <!-- DESIGN FOR DESKTOP VIEW -->
      <div
        class="fit column wrap justify-around desktop-only"
        style="max-width: 32vw; min-height: 720px; min-width: 480px"
      >
        <div class="row q-pa-sm-sm q-pa-md">
          <div class="col">
            <q-card-section>
              <div class="q-mb-lg">
                <div class="flex">
                  <div
                    class="text-32 q-my-none text-primary q-mb-md text-weight-medium"
                  >
                    Sign in
                  </div>
                </div>
              </div>

              <q-form class="q-gutter-y-md text-16">
                <div>
                  <div class="text-grey-7 q-mb-sm">Email or Username</div>
                  <q-input
                    borderless
                    v-model="form.emailOrUsername"
                    autocomplete="off"
                    placeholder="Enter email or username"
                    name="emailOrUsername"
                    class="input-type q-px-lg"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>

                <div class="q-pt-md q-mb-md">
                  <div class="row justify-between">
                    <div class="text-grey-7">Password</div>
                    <div
                      class="row text-grey-7 cursor-pointer"
                      v-on:click="isPwd = !isPwd"
                    >
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        size="xs"
                        class="q-mr-xs q-mt-xs"
                      />
                      Hide
                    </div>
                  </div>
                  <q-input
                    borderless
                    v-model="form.password"
                    :type="isPwd ? 'password' : form.password"
                    autocomplete="off"
                    placeholder="Enter your password"
                    name="password"
                    class="input-type q-px-lg q-mt-sm"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <q-btn
                  unelevated
                  no-caps
                  class="btn-default q-py-md q-px-xl text-22"
                  color="primary"
                  label="Sign in"
                  @click="submit()"
                ></q-btn>

                <div
                  class="row q-mb-xl q-mt-sm text-black justify-between invisible"
                  style="margin-left: -6px"
                >
                  <!-- <q-checkbox v-model="right" label="Remember me" size="sm" /> -->
                  <q-checkbox
                    label="Remember me"
                    size="sm"
                    v-model="rememberMe"
                    class="hidden"
                  />
                  <div class="cursor-pointer q-mt-sm">Need help?</div>
                </div>

                <div class="fit row items-end text-grey-7 q-pt-lg">
                  <div class="self-end" style="text-wrap: wrap !important">
                    <div class="text-bold">Don't have an account yet?</div>
                    Ask your administrator to create one for you.
                    <!-- <router-link
                      class="text-primary text-bold q-ml-xs"
                      to="/register"
                      >Register using your email.</router-link
                    > -->
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </div>
        </div>
      </div>

      <!-- DESIGN FOR MOBILE VIEW -->
      <div
        class="fit column wrap justify-around mobile-only"
        style="max-width: 32vw; min-height: 720px; min-width: 80vw"
      >
        <div class="row q-pa-sm-sm q-pa-md">
          <div class="col">
            <q-card-section>
              <div class="q-mb-lg">
                <div class="flex">
                  <div
                    class="text-32 q-my-none text-primary q-mb-md text-weight-medium"
                  >
                    Sign in
                  </div>
                </div>
              </div>

              <q-form class="q-gutter-y-md text-16">
                <div>
                  <div class="text-grey-7 q-mb-sm">Email or Username</div>
                  <q-input
                    borderless
                    v-model="form.emailOrUsername"
                    autocomplete="off"
                    placeholder="Enter email or username"
                    name="emailOrUsername"
                    class="input-type q-px-lg"
                  />
                </div>

                <div class="q-pt-md q-mb-md">
                  <div class="row justify-between">
                    <div class="text-grey-7">Password</div>
                    <div
                      class="row text-grey-7 cursor-pointer"
                      v-on:click="isPwd = !isPwd"
                    >
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        size="xs"
                        class="q-mr-xs q-mt-xs"
                      />
                      Hide
                    </div>
                  </div>
                  <q-input
                    borderless
                    v-model="form.password"
                    :type="isPwd ? 'password' : form.password"
                    autocomplete="off"
                    placeholder="Enter your password"
                    name="password"
                    class="input-type q-px-lg q-mt-sm"
                  />
                </div>
                <q-btn
                  unelevated
                  no-caps
                  class="btn-default q-py-md q-px-xl text-22"
                  color="primary"
                  label="Sign in"
                  @click="submit()"
                ></q-btn>

                <div
                  class="row q-mb-xl q-mt-sm text-black justify-between invisible"
                  style="margin-left: -6px"
                >
                  <!-- <q-checkbox v-model="right" label="Remember me" size="sm" /> -->
                  <q-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    size="sm"
                  />
                  <div class="cursor-pointer q-mt-sm">Need help?</div>
                </div>

                <div class="fit row items-end text-grey-7 q-pt-lg">
                  <div class="self-end" style="text-wrap: wrap !important">
                    <div class="text-bold">Don't have an account yet?</div>
                    Ask your administrator to create one for you.
                    <!-- <router-link
                      class="text-primary text-bold q-ml-xs"
                      to="/register"
                      >Register using your email.</router-link
                    > -->
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<!-- <script setup>
import { ref, reactive } from "vue";
import login from "../boot/firebase-login";
// import routes from "src/router";
import { useRouter, useRoute } from "vue-router";

// Router
const router = useRouter();

const user = reactive({
  email: null,
  password: null,
});

const form = ref(null);

const submit = async () => {
  if (form.value.validate()) {
    try {
      await login(user);
      router.push({ path: "/pyforecast" });
      // setTimeout(() => {
      //   router.reload();
      // }, 3000);
      // router.push({ name: 'dashboard' });
      // router.go();
    } catch (err) {}
  }
};

const rememberMe = ref(true);
const isPwd = ref(true);
</script> -->
<!-- // Form
    const form = ref({
      id: null,
      prefix: "",
      userType: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      username: "",
      password: "",
    }); -->

<script>
import { ref } from "vue";
import { UserLogin } from "../server/index";
import { useRouter, useRoute } from "vue-router";
import { LocalStorage, useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar(); // q
    const router = useRouter(); // Router

    // References
    const rememberMe = ref(true);
    const isPwd = ref(true);

    const form = ref({
      emailOrUsername: "",
      password: "",
    });

    const error = ref(null); // To store login error message

    const submit = () => {
      const userData = {
        emailOrUsername: form.value.emailOrUsername,
        password: form.value.password,
      };

      UserLogin(userData).then((response) => {
        // Handle successful login
        // Store token and user session data in local storage
        LocalStorage.set("token", response.token);
        LocalStorage.set("userType", response.user_type);
        LocalStorage.set("userData", response.existingUser);
        LocalStorage.set(`${response.user_type}`);
        LocalStorage.getItem("userData");

        // Redirect to dashboard
        router.push({ path: "/pyforecast" });
      });

      setTimeout(() => {
        const sessionData = LocalStorage.getItem("userSession");
        if (sessionData === null) {
          $q.notify({
            // Post notification on lower right side on the organizational management page
            position: $q.screen.width < 767 ? "top" : "bottom-right",
            classes:
              "my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md",
            html: true,
            message: `<div class="text-bold">Failed to login!</div> Please try again.`,
          });
        }
      }, 3000);
    };

    return {
      router,
      rememberMe,
      isPwd,
      form,
      error,
      submit,
    };
  },
};
</script>
