<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="pt-0-important">
      <q-page class="relative fit">
        <div class="row container">
          <div
            class="col-4 flex content-center justify-center bg-logo desktop-only"
          ></div>
          <div
            class="col flex content-center justify-center q-ma-xl"
          >
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass" scoped>
.bg-logo
  background-color: #f0f4f3
  background-image: url("../assets/signin-bg.png")
  background-size: cover
  background-repeat: no-repeat
  background-position: center

.container
  height: 100vh
</style>
