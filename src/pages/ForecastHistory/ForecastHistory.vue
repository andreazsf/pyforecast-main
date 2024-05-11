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
          :class="isButtonClicked ? '' : 'q-pb-xl'"
          :style="isButtonClicked ? '' : 'min-height: 90vh'"
          id="element-to-convert"
        >
          <!-- Heading -->
          <div>
            <div class="" :class="isButtonClicked ? 'text-h4' : 'text-h3'">
              Forecasts
            </div>
            <p class="text-grey-6 q-mt-sm">
              Here, you can see the history of all forecasted data.
            </p>
          </div>

          <!-- Forecast Content -->
          <div
            class="items-center my-bg-accent-0 rounded-borders"
            :class="
              isButtonClicked ? 'q-px-md q-pt-lg text-10' : 'q-pa-lg text-16'
            "
            :style="isButtonClicked ? 'margin-top: 24px !important' : ''"
          >
            <div :class="isButtonClicked ? 'hidden' : ''">
              <q-list
                class="flex q-gutter-x-lg my-text-accent-2 row justify-end"
                :class="$q.screen.width <= 414 ? '' : 'q-mb-lg'"
              >
                <q-item
                  class="col justify-end"
                  :class="
                    $q.screen.width <= 414
                      ? 'full-width q-gutter-x-md'
                      : 'q-gutter-x-lg row'
                  "
                >
                  <q-btn
                    no-caps
                    flat
                    icon="download"
                    class="bg-primary text-white text-weight-regular rounded-borders-10"
                    :label="$q.screen.width <= 414 ? '' : 'Download'"
                    @click="exportToPDF"
                  >
                    <div :class="$q.screen.width <= 414 ? 'hidden' : ''">
                      &nbsp;&nbsp;
                    </div>
                  </q-btn>
                </q-item>
              </q-list>
            </div>

            <!-- Filters and Pagination -->
            <div :class="isButtonClicked ? 'hidden' : ''">
              <q-list :class="$q.screen.width <= 414 ? 'row' : 'q-mb-lg row'">
                <q-item class="col">
                  <Filters
                    :labelVisible="true"
                    :searchVisible="true"
                    :selectVisible="true"
                    :filterDateVisible="true"
                    :dateRangeVisible="true"
                    path="forecasthistories"
                    :class="$q.screen.width <= 414 ? 'hidden' : ''"
                  />
                  <Filters
                    :labelVisible="false"
                    :searchVisible="true"
                    :selectVisible="true"
                    :filterDateVisible="true"
                    :dateRangeVisible="true"
                    path="forecasthistories"
                    :class="$q.screen.width <= 414 ? '' : 'hidden'"
                  />
                </q-item>
                <q-item
                  class="col-auto items-start q-gutter-x-md"
                  :class="$q.screen.width <= 414 ? 'hidden' : ''"
                >
                  <q-btn
                    flat
                    @click="showAllRows()"
                    :disable="!Search.length"
                    label="Show All"
                    class="my-input-field rounded-borders-16 my-show-all-btn"
                    size="12px"
                  />
                  <Pagination
                    v-model:pagination="pagination"
                    :numRows="rows"
                    @update:pagination="updatePagination"
                  />
                </q-item>
                <div
                  class="col-auto items-start q-gutter-y-sm q-mt-sm q-pt-xs q-mr-md"
                  :class="$q.screen.width <= 414 ? '' : 'hidden'"
                >
                  <q-btn
                    flat
                    @click="showAllRows()"
                    :disable="!Search.length"
                    label="Show All"
                    class="my-input-field rounded-borders-16 my-show-all-btn"
                    size="12px"
                  />
                  <Pagination
                    v-model:pagination="pagination"
                    :numRows="rows"
                    @update:pagination="updatePagination"
                    :style="$q.screen.width <= 414 ? 'padding-left: 2px' : ''"
                  />
                </div>
              </q-list>
            </div>

            <!-- Table -->
            <q-table
              :rows="Search"
              :columns="columns"
              :rows-per-page-options="[0]"
              row-key="id"
              class="my-table my-table-row-width q-mx-md"
              flat
              :class="{ 'styled-content': isButtonClicked }"
            >
              <!-- More actions -->
              <template v-slot:body-cell-actions="props">
                <q-td
                  :props="props"
                  style="padding-right: 16px"
                  class="text-right"
                >
                  <!-- More Btns -->
                  <q-btn
                    icon="more_vert"
                    class="my-text-primary"
                    flat
                    round
                    dense
                  />
                  <q-menu
                    :offset="[-20, -20]"
                    class="overflow-hidden rounded-borders q-py-sm"
                  >
                    <q-list class="q-py-sm">
                      <q-item
                        clickable
                        @click="
                          deleteRecordDialog = true;
                          rememberRowToDelete(props.row);
                        "
                        v-close-popup
                        class="menu-list q-py-md"
                        style="width: 224px"
                      >
                        <q-item-section avatar>
                          <q-icon
                            name="cancel"
                            size="sm"
                            class="material-symbols-outlined q-ml-md"
                          />
                        </q-item-section>
                        <q-item-section> Delete Record </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-td>
              </template>
              <!-- Handle table when data not available -->
              <template v-if="!Search.length" v-slot:bottom-row>
                <q-tr>
                  <q-td
                    colspan="100%"
                    class="text-center"
                    style="font-weight: normal; border-radius: 12px !important"
                  >
                    No Data Available
                  </q-td>
                </q-tr>
              </template>
            </q-table>

            <!-- Delete record form pop up -->
            <q-dialog v-model="deleteRecordDialog" persistent>
              <q-card
                style="width: 490px; max-width: 80vw"
                class="q-pa-lg rounded-borders-16"
              >
                <q-card-section class="text-center text-16">
                  Are you sure you want to delete this record?
                </q-card-section>

                <q-card-actions align="center" class="bg-white text-16">
                  <q-btn
                    @click="deleteRecord()"
                    no-caps
                    flat
                    label="Yes"
                    class="my-bg-accent-5 text-white rounded-borders-16 text-black q-mr-sm"
                    :style="
                      $q.screen.width <= 414
                        ? 'width: 96px; height: 56px'
                        : 'width: 128px; height: 56px'
                    "
                    v-close-popup
                  />
                  <q-btn
                    no-caps
                    flat
                    label="Cancel"
                    class="my-bg-accent-4 text-white rounded-borders-16"
                    :style="
                      $q.screen.width <= 414
                        ? 'width: 96px; height: 56px'
                        : 'width: 128px; height: 56px'
                    "
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </q-scroll-area>
    </q-page>
  </transition>
</template>

<script src="src/pages/ForecastHistory/scripts/ForecastHistory.js"></script>

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
</style>
