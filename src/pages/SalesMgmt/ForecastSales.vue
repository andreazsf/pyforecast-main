<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <q-page
      class="flex flex-center bg-white"
      :class="{ hidden: isButtonClicked }"
    >
      <q-scroll-area
        class="absolute full-width full-height"
        :thumb-style="
          $q.screen.width <= 820
            ? {
                background: 'transparent',
                opacity: 0,
              }
            : {}
        "
      >
        <div
          class="full-width q-px-lg q-pt-md"
          :style="{ 'min-height: 90vh': !isButtonClicked }"
          id="element-to-convert"
        >
          <!-- Heading -->
          <div>
            <div class="text-h3" v-if="unitName !== ''">
              Sales | {{ unitName }}
            </div>
            <div class="text-h3" v-else>Sales</div>
            <p class="text-grey-6 q-mt-sm">
              Here, you can view the forecasted sales data.
            </p>
          </div>

          <!-- Sales Content -->
          <div class="text-16">
            <div
              class="flex q-px-lg justify-end"
              :class="isButtonClicked ? 'hidden' : ''"
            >
              <q-btn
                :disable="!labels.length && !datasets.length"
                no-caps
                flat
                icon="download"
                class="bg-primary text-white text-weight-regular q-px-lg rounded-borders-10"
                label="Download"
                @click="exportToPDF"
              >
                &nbsp;&nbsp;
              </q-btn>
            </div>

            <!-- Line Charts -->
            <div :class="{ 'styled-content': isButtonClicked }">
              <div
                class="flex flex-center"
                :class="isButtonClicked ? 'q-pt-md' : 'q-pt-xl'"
              >
                <LineChart
                  v-if="labels.length && datasets.length"
                  :data="{ labels, datasets }"
                  :options="options"
                  style="width: 100% !important; height: 56vh"
                  :class="{ 'chart-download': isButtonClicked }"
                />
                <!-- If Chart isn't available yet, or isn't really available, show loading -->
                <q-card
                  v-else
                  class="flex justify-center items-center full-width q-pr-xl"
                  flat
                >
                  <q-spinner-dots class="text-primary" size="1.5em" />
                </q-card>
                <!-- <div >No Data Available</div> -->
                <br />
              </div>

              <div
                class="row flex q-mt-md text-subtitle2 text-weight-regular"
                v-if="labels.length && datasets.length"
              >
                <div
                  class="text-grey-6 col q-ml-lg q-pl-md"
                  :class="isButtonClicked ? 'invisible' : 'desktop-only'"
                >
                  <p class="q-ml-md">
                    <q-icon
                      name="info"
                      class="material-symbols-outlined q-mr-xs"
                      size="xs"
                      style="margin-bottom: 2px; margin-left: 2px"
                    />
                    <b>Hover data points</b> to see sales values.
                  </p>
                </div>
                <!-- Errors -->
                <div
                  class="text-12 q-gutter-x-md q-mr-lg text-right justify-end"
                  :class="isButtonClicked ? 'row' : 'col'"
                >
                  <div class="row justify-end">
                    MSE:
                    <div class="text-red q-pl-xs">{{ mseErrorValue }}</div>
                  </div>
                  <div class="row justify-end">
                    r²:
                    <div class="text-red q-pl-xs">{{ rsquaredErrorValue }}</div>
                  </div>
                </div>
              </div>

              <!-- Actual Sales Values -->
              <!-- <div class="q-ml-xl q-pl-md q-mt-md">
                <div class="" :class="isButtonClicked ? '' : 'hidden'">
                  <div
                    v-if="labels.length && datasets.length"
                    class="text-dark text-center"
                  >
                    <div class="row q-gutter-x-sm q-gutter-y-sm text-caption">
                      <q-card
                        v-for="(label, index) in labels"
                        :key="index"
                        class="bg-grey-2 rounded-borders q-py-sm"
                        flat
                        style="min-width: 160px !important"
                      >
                        <div>{{ label }}</div>
                        <div>Sales: {{ roundValue(forecastY[0][index]) }}</div>
                      </q-card>
                    </div>
                  </div>
                  <br />
                </div>
              </div> -->

              <!-- Sales Data, and Forecasted Values -->
              <div class="text-16" :class="isButtonClicked ? '' : 'hidden'">
                <div class="q-mx-lg q-mt-lg text-caption">
                  <div class="items-center q-pa-lg my-bg-accent-0">
                    <!-- Table -->
                    <q-table
                      :rows="rows"
                      :columns="columns"
                      :rows-per-page-options="[0]"
                      class="my-table my-table-row-width q-mx-md"
                      flat
                    >
                    </q-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-page>
  </transition>
</template>

<script src="src/pages/SalesMgmt/scripts/ForecastSales.js"></script>

<style>
.styled-content {
  page-break-inside: avoid; /* Avoid breaking inside the element */
  page-break-after: auto; /* Automatically manage breaks after the element */
  page-break-before: auto; /* Automatically manage breaks before the element */
}

/* Ensure that no direct child inside `.styled-content` prevents breaks */
.styled-content * {
  page-break-inside: avoid;
}

.chart-download {
  height: 536px !important;
}
</style>
