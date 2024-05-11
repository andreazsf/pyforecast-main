<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <q-page class="flex flex-center bg-white">
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
          class="full-width q-px-lg q-pb-xl q-pt-md"
          style="min-height: 90vh"
        >
          <!-- Heading -->
          <div>
            <div class="text-h3">Sales</div>
            <p class="text-grey-6 q-mt-sm">
              Here, you can modify the sales data.
            </p>
          </div>

          <!-- Sales Content -->
          <div
            class="items-center text-16 q-pa-lg my-bg-accent-0 rounded-borders"
          >
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
                  icon="query_stats"
                  class="bg-primary text-white text-weight-regular rounded-borders-10"
                  :class="checkIfAdmin ? '' : 'hidden'"
                  :label="$q.screen.width <= 414 ? '' : 'Forecast'"
                  :loading="loading"
                  @click="addForecastData()"
                  :disable="!Search.length || Search.length <= 1"
                  ><div class="gt-md q-pr-sm"></div>
                  <template v-slot:loading>
                    <q-spinner-hourglass
                      :class="$q.screen.width <= 414 ? '' : 'on-left'"
                    ></q-spinner-hourglass>
                    <div :class="$q.screen.width <= 414 ? 'hidden' : ''">
                      Loading...
                    </div>
                  </template>
                </q-btn>
                <q-btn
                  no-caps
                  flat
                  icon="playlist_add"
                  class="bg-primary text-white text-weight-regular rounded-borders-10"
                  style="line-height: 1.2"
                  :label="$q.screen.width <= 414 ? '' : 'Add a new record'"
                  @click="
                    addNewRecordDialog = true;
                    fetchAll();
                  "
                  ><div class="gt-md q-pr-sm"></div>
                </q-btn>
              </q-item>
            </q-list>

            <!-- Filters and Pagination -->
            <q-list :class="$q.screen.width <= 414 ? 'row' : 'q-mb-lg row'">
              <q-item class="col">
                <Filters
                  :labelVisible="true"
                  :searchVisible="true"
                  :selectVisible="true"
                  :filterDateVisible="true"
                  :dateRangeVisible="true"
                  path="sales"
                  :class="$q.screen.width <= 414 ? 'hidden' : ''"
                />
                <Filters
                  :labelVisible="false"
                  :searchVisible="true"
                  :selectVisible="true"
                  :filterDateVisible="true"
                  :dateRangeVisible="true"
                  path="sales"
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

            <!-- Table -->
            <q-table
              :rows="Search"
              :columns="columns"
              :rows-per-page-options="[0]"
              row-key="id"
              class="my-table my-table-row-width q-mx-md"
              flat
            >
              <!-- More actions -->
              <template v-slot:body-cell-actions="props">
                <q-td
                  :props="props"
                  style="padding-right: 16px"
                  class="text-right"
                >
                  <q-btn
                    icon="more_vert"
                    class="my-text-primary"
                    flat
                    round
                    dense
                  />
                  <q-menu
                    :offset="[-20, -5]"
                    class="overflow-hidden rounded-borders q-py-sm"
                  >
                    <q-list class="q-py-sm">
                      <q-item
                        clickable
                        @click="
                          pushAccount(props.row);
                          editRecordDialog = true;
                        "
                        v-close-popup
                        class="menu-list q-py-md"
                        style="width: 224px"
                      >
                        <q-item-section avatar>
                          <q-icon
                            name="edit"
                            size="sm"
                            class="material-symbols-outlined q-ml-md"
                          />
                        </q-item-section>
                        <q-item-section>Edit Details</q-item-section>
                      </q-item>
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

            <!-- Form to add a new record -->
            <q-dialog v-model="addNewRecordDialog" persistent>
              <q-card
                style="width: 490px; max-width: 80vw"
                class="q-pa-lg rounded-borders-16"
                :style="
                  $q.screen.width <= 414
                    ? 'max-height: 64vh; overflow: scroll;'
                    : ''
                "
              >
                <q-form>
                  <q-card-section class="q-pb-lg q-mb-md q-gutter-y-md text-16">
                    <div class="row q-gutter-x-lg">
                      <div class="col">
                        <div class="text-black q-mb-sm">Unit Name</div>
                        <q-select
                          v-model="form.unitName"
                          :label="
                            form.unitName !== '' ? '' : 'Select unit name'
                          "
                          emit-value
                          map-options
                          option-label="label"
                          option-value="value"
                          :options="optionsForUnitName"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          popup-content-class="my-option-style-light q-py-sm"
                          options-selected-class="selected-class"
                          transition-show="scale"
                          transition-hide="scale"
                          borderless
                          autocomplete="off"
                          placeholder=""
                          class="input-type q-px-lg"
                        />
                      </div>
                    </div>
                    <div
                      class="q-gutter-x-lg"
                      :class="
                        $q.screen.width <= 414 ? 'col q-gutter-y-md' : 'row'
                      "
                    >
                      <div class="col">
                        <div class="text-black q-mb-sm">Total Sales</div>
                        <q-input
                          v-model="form.totalSales"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          borderless
                          autocomplete="off"
                          class="input-type q-px-lg"
                          placeholder="Enter total sales"
                          type="number"
                          @keypress="validateNumericInput"
                        />
                      </div>
                      <div class="col">
                        <div class="text-black q-mb-sm">Date</div>
                        <q-input
                          v-model="form.date"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          borderless
                          autocomplete="off"
                          class="input-type q-px-lg cursor-pointer"
                          mask="##-####"
                          placeholder="MM-YYYY"
                          readonly
                        >
                          <template v-slot:append>
                            <q-icon
                              name="calendar_today"
                              class="cursor-pointer my-text-accent-2"
                            >
                              <q-popup-proxy
                                class="rounded-borders"
                                ref="date"
                                cover
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  @update:model-value="() => $refs.date.hide()"
                                  v-model="form.date"
                                  mask="MM-YYYY"
                                  :emit-value="true"
                                  @input="formatDate"
                                  minimal
                                  flat
                                  class="my-bg-accent-0 text-black"
                                  color="white"
                                  text-color="black"
                                />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="bg-white text-16">
                    <q-btn
                      @click="addSalesData()"
                      :disable="!isFormValid()"
                      no-caps
                      flat
                      label="Save"
                      class="my-bg-accent-5 text-white rounded-borders-16 text-black q-mr-sm"
                      :style="
                        $q.screen.width <= 414
                          ? 'width: 96px; height: 56px'
                          : 'width: 128px; height: 56px'
                      "
                      v-close-popup
                    />
                    <q-btn
                      @click="fetchAll()"
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
                </q-form>
              </q-card>
            </q-dialog>

            <!-- Form to edit record -->
            <q-dialog v-model="editRecordDialog" persistent>
              <q-card
                style="width: 490px; max-width: 80vw"
                class="q-pa-lg rounded-borders-16"
                :style="
                  $q.screen.width <= 414
                    ? 'max-height: 64vh; overflow: scroll;'
                    : ''
                "
              >
                <q-form>
                  <q-card-section class="q-pb-lg q-mb-md q-gutter-y-md text-16">
                    <div class="row q-gutter-x-lg">
                      <div class="col">
                        <div class="text-black q-mb-sm">Unit Name</div>
                        <q-select
                          v-model="form.unitName"
                          :label="
                            form.unitName !== '' ? '' : 'Select unit name'
                          "
                          emit-value
                          map-options
                          option-label="label"
                          option-value="value"
                          :options="optionsForUnitName"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          popup-content-class="my-option-style-light q-py-sm"
                          options-selected-class="selected-class"
                          transition-show="scale"
                          transition-hide="scale"
                          borderless
                          autocomplete="off"
                          placeholder=""
                          class="input-type q-px-lg"
                        />
                      </div>
                    </div>
                    <div
                      class="q-gutter-x-lg"
                      :class="
                        $q.screen.width <= 414 ? 'col q-gutter-y-md' : 'row'
                      "
                    >
                      <div class="col">
                        <div class="text-black q-mb-sm">Total Sales</div>
                        <q-input
                          v-model="form.totalSales"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          borderless
                          autocomplete="off"
                          class="input-type q-px-lg"
                          placeholder="Enter total sales"
                          type="number"
                          @keypress="validateNumericInput"
                        />
                      </div>
                      <div class="col">
                        <div class="text-black q-mb-sm">Date</div>
                        <q-input
                          v-model="form.date"
                          :rules="[(val) => !!val || '']"
                          hide-bottom-space
                          borderless
                          autocomplete="off"
                          class="input-type q-px-lg"
                          mask="##-####"
                          placeholder="MM-YYYY"
                          readonly
                        >
                          <template v-slot:append>
                            <q-icon
                              name="calendar_today"
                              class="cursor-pointer my-text-accent-2"
                            >
                              <q-popup-proxy
                                class="rounded-borders"
                                ref="date"
                                cover
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  @update:model-value="() => $refs.date.hide()"
                                  v-model="form.date"
                                  mask="MM-YYYY"
                                  :emit-value="true"
                                  @input="formatDate"
                                  minimal
                                  flat
                                  class="my-bg-accent-0 text-black"
                                  color="white"
                                  text-color="black"
                                />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="bg-white text-16">
                    <q-btn
                      @click="editRecord()"
                      :disable="!isFormValid()"
                      no-caps
                      flat
                      label="Save"
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
                </q-form>
              </q-card>
            </q-dialog>

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

<script src="src/pages/SalesMgmt/scripts/SalesMgmt.js"></script>

<style>
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>
