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
                    Register
                  </div>
                </div>
              </div>

              <q-form ref="form" @submit="submit" class="q-gutter-y-lg text-16">
                <div class="row">
                  <div class="col q-pr-md">
                    <div class="text-grey-7 q-mb-sm">First name</div>
                    <q-input
                      borderless
                      class="input-type q-px-lg"
                      autocomplete="off"
                      v-model="user.first_name"
                      placeholder="Enter first name"
                      name="First Name"
                    />
                  </div>
                  <div class="col">
                    <div class="text-grey-7 q-mb-sm">Last name</div>
                    <q-input
                      borderless
                      class="input-type q-px-lg"
                      autocomplete="off"
                      v-model="user.last_name"
                      placeholder="Enter last name"
                      name="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Email</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg"
                    autocomplete="off"
                    v-model="user.email"
                    placeholder="Enter your email"
                    name="Email"
                  />
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Password</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg"
                    autocomplete="off"
                    v-model="user.password"
                    placeholder="Enter your password"
                    name="password"
                    type="password"
                  />
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Confirm Password</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg q-mb-sm"
                    autocomplete="off"
                    placeholder="Confirm your password"
                    name="password"
                    type="password"
                  />
                  <q-btn
                    unelevated
                    no-caps
                    class="btn-default q-py-md q-px-xl q-mt-lg text-22"
                    color="primary"
                    label="Register"
                    rounded
                    type="submit"
                  />
                </div>

                <div class="q-mt-xl">
                  <div class="q-mt-sm text-grey-7">
                    Already have an account?
                    <router-link to="/login" class="text-bold text-primary"
                      >Return to sign in page.</router-link
                    >
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
                    Register
                  </div>
                </div>
              </div>

              <q-form ref="form" @submit="submit" class="q-gutter-y-lg text-16">
                <div class="row">
                  <div class="col q-pr-md">
                    <div class="text-grey-7 q-mb-sm">First name</div>
                    <q-input
                      borderless
                      class="input-type q-px-lg"
                      autocomplete="off"
                      v-model="user.first_name"
                      placeholder="Enter first name"
                      name="First Name"
                    />
                  </div>
                  <div class="col">
                    <div class="text-grey-7 q-mb-sm">Last name</div>
                    <q-input
                      borderless
                      class="input-type q-px-lg"
                      autocomplete="off"
                      v-model="user.last_name"
                      placeholder="Enter last name"
                      name="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Email</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg"
                    autocomplete="off"
                    v-model="user.email"
                    placeholder="Enter your email"
                    name="Email"
                  />
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Password</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg"
                    autocomplete="off"
                    v-model="user.password"
                    placeholder="Enter your password"
                    name="password"
                    type="password"
                  />
                </div>
                <div>
                  <div class="text-grey-7 q-mb-sm">Confirm Password</div>
                  <q-input
                    borderless
                    class="input-type q-px-lg q-mb-sm"
                    autocomplete="off"
                    placeholder="Confirm your password"
                    name="password"
                    type="password"
                  />
                  <q-btn
                    unelevated
                    no-caps
                    class="btn-default q-py-md q-px-xl q-mt-lg text-22"
                    color="primary"
                    label="Register"
                    rounded
                    type="submit"
                  />
                </div>

                <div class="q-mt-xl">
                  <div class="q-mt-sm text-grey-7">
                    Already have an account?
                    <router-link to="/login" class="text-bold text-primary"
                      >Return to sign in page.</router-link
                    >
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

<!-- <script src="./scripts/x.js"></script> -->

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import register from "../boot/firebase-register";

const user = reactive({
  last_name: null,
  first_name: null,
  email: null,
  password: null,
});

const form = ref(null);

const submit = async () => {
  if (form.value.validate() && !!(await register(user))) {
    const router = useRouter();
    router.push("/app");
  }
};
</script>
