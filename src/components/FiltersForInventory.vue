<template>
  <div class="filters-component">
    <div
      :class="
        isLabelVisible && $q.screen.width <= 820
          ? 'flex row items-start'
          : 'flex row items-center'
      "
    >
      <!-- FILTER LABEL -->
      <div
        v-if="isLabelVisible"
        class="col-auto text-14 text-weight-medium q-mr-lg"
      >
        Filters:
      </div>
      <div
        class="col flex q-gutter-y-sm"
        :class="
          $q.screen.width <= 414
            ? 'justify-start q-gutter-sm q-mt-xs'
            : 'justify-start'
        "
      >
        <!-- SEARCH FILTER -->
        <q-input
          v-if="isSearchVisible"
          :class="`minmax-width my-input-field height-31 use-input q-px-md
          ${isLabelVisible && 'q-mr-md'}`"
          dense
          borderless
          v-model="keyword"
          placeholder="Search"
          @keydown.enter="searchKeyword()"
        >
          <template v-slot:append>
            <q-icon
              v-if="keyword"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
            <q-icon
              @click="searchKeyword() && filter('category') && filter('time')"
              class="cursor-pointer text-black"
              :class="!keyword && 'disabled'"
              name="search"
            />
          </template>
        </q-input>

        <!-- SELECT TYPE FOR SALES NAMES FILTER -->
        <q-select
          v-if="isSelectForSalesPgVisible"
          class="minmax-width my-select-field height-31 q-mr-md"
          dense
          borderless
          v-model="type"
          :label="type !== null ? '' : 'Select name'"
          @update:model-value="filter('category')"
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :options="dynamicInventoryTypeOptions"
          hide-bottom-space
          :popup-content-class="
            DarkMode ? 'my-option-style-dark' : 'my-option-style-light'
          "
          transition-show="scale"
          transition-hide="scale"
          options-selected-class="selected-class"
        >
          <!-- <template v-slot:append>
            <q-icon
              v-if="type"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
          </template> -->
        </q-select>

        <!-- DATE FILTER -->
        <q-select
          v-if="isFilterDateVisible"
          dense
          borderless
          v-model="date_session"
          @update:model-value="filter('time')"
          :options="dateOptions"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          :class="`minmax-width my-select-field height-31 text-14 ${
            isLabelVisible && 'q-mr-md'
          }`"
          :label="date_session !== null ? '' : 'Select date'"
          :popup-content-class="
            DarkMode ? 'my-option-style-dark' : 'my-option-style-light'
          "
          transition-show="scale"
          transition-hide="scale"
          options-selected-class="selected-class"
        >
          <!-- <template v-slot:append>
            <q-icon
              v-if="date_session !== null"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
          </template> -->
          <!-- <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="placeholder" />
          </template> -->
          <template v-slot:after-options>
            <q-separator class="my-text-accent-0" />
            <div v-if="isDateRangeVisible" class="q-px-sm">
              <!-- <q-item-section class="my-text-accent-2 q-my-sm"
                >Custom Range</q-item-section
              > -->
              <q-form ref="formDateRange" greedy>
                <div class="q-mt-sm">
                  <label>From</label>
                  <q-input
                    class="my-border-accent-0 my-border-radius-5 my-input-field filter-date-field q-px-sm label-accent-2"
                    v-model="fromDate"
                    borderless
                    dense
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    @focus="$refs.startDate.show()"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="calendar_today"
                        class="cursor-pointer my-text-accent-2"
                      >
                        <q-popup-proxy
                          class="rounded-borders"
                          ref="startDate"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            @update:model-value="() => $refs.startDate.hide()"
                            v-model="fromDate"
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
                <div class="q-mt-xs">
                  <label>To</label>
                  <q-input
                    class="filter-date-field my-border-radius-5 my-input-field my-border-accent-0 label-accent-2 q-px-sm"
                    v-model="toDate"
                    borderless
                    dense
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    @focus="$refs.endDate.show()"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="calendar_today"
                        class="cursor-pointer my-text-accent-2 margin-top-n13 my-text-accent-1 text-14"
                      >
                        <q-popup-proxy
                          ref="endDate"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            @update:model-value="() => $refs.endDate.hide()"
                            v-model="toDate"
                            mask="MM-YYYY"
                            :emit-value="true"
                            @input="formatDate"
                            minimal
                            flat
                            class="my-bg-accent-0 text-black"
                            color="white"
                            text-color="black"
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </q-form>
              <div class="q-mb-md q-mt-sm">
                <q-btn
                  @click="submitDateRange()"
                  class="rounded-borders-16 bg-primary q-mt-sm text-white full-width"
                  label="Apply"
                  :disable="btnLoadingState"
                  flat
                  no-caps
                  dense
                />
              </div>
            </div>
            <div v-else class="q-pa-sm">
              <label>Date</label>
              <q-input
                class="my-border-accent-0 my-border-radius-5 my-input-field filter-date-field q-px-sm label-accent-2"
                :model-value="dateSelected"
                borderless
                dense
                hide-bottom-space
                readonly
              >
                <template v-slot:append>
                  <q-icon
                    name="calendar_today"
                    class="cursor-pointer margin-top-n13 my-text-accent-2 text-14"
                  >
                    <q-popup-proxy
                      ref="selectDate"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        @update:model-value="() => $refs.selectDate.hide()"
                        v-model="dateSelected"
                        minimal
                        flat
                        class="my-bg-accent-0 text-white"
                        color="white"
                        text-color="black"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
// import { useStore } from "vuex";
import { useQuasar } from "quasar";
import {
  GetSearchResult,
  SearchedParams,
} from "../composables/SearchForInventory";
// import { DarkMode } from 'src/core/composables/Triggers';

import { selectedInventoryType } from "../composables/References";

export default {
  props: {
    labelVisible: {
      type: Boolean,
      default: true,
    },
    selectVisible: {
      type: Boolean,
      default: false,
    },
    searchVisible: {
      type: Boolean,
      default: false,
    },
    filterDateVisible: {
      type: Boolean,
      default: true,
    },
    dynamicOptionsForSalesPg: {
      type: Array,
      default: () => [
        {
          value: "Item A",
          label: "Item A",
        },
      ],
    },
    dynamicOptionsForBooksPg: {
      type: Array,
      default: () => [],
    },
    pathEndPoint: {
      type: String,
      default: "",
    },
    dateRangeVisible: {
      type: Boolean,
      default: true,
    },
    dynamicDateOptions: {
      type: Array,
      default: () => [
        {
          value: 0,
          label: "All Time",
        },
      ],
    },
    methods: {
      formatDate(value) {
        // Parse the input value as MM/YYYY
        const [month, year] = value.split("-");
        // Set the selectedDate to the first day of the month in YYYY-MM-DD format
        this.selectedDate = `${year}-${month.padStart(2, "0")}-01`;
      },
    },
    parameters: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const $q = useQuasar();
    // let store = useStore();

    // Filter references if visible
    let isLabelVisible = ref(props.labelVisible);
    let isSelectForSalesPgVisible = ref(props.selectVisible);
    let isSearchVisible = ref(props.searchVisible);
    let isFilterDateVisible = ref(props.filterDateVisible);
    let isDateRangeVisible = ref(props.dateRangeVisible);

    // Date references
    let dateSelected = ref(null);
    let fromDate = ref(null);
    let toDate = ref(null);
    let date_session = ref(null);

    // Dynamic options references
    let optionsForSalesPg = ref(props.dynamicOptionsForSalesPg);
    const dateOptions = ref(props.dynamicDateOptions);

    let params = ref(props.parameters);
    let endPoint = ref(props.pathEndPoint);

    let type = ref(null);
    let keyword = ref(null);

    let btnLoadingState = ref(false);
    let DarkMode = ref(false);

    // To check what inventory type is clicked from InventoryMgmt pg
    const inventoryType = ref(selectedInventoryType.value);

    // Watch for changes in the const ref
    watch(selectedInventoryType, (newValue, oldValue) => {
      // console.log("selectedInventoryType changed:", newValue, oldValue);

      // Change inventoryType whenever selectedInventoryType is changes
      inventoryType.value = newValue;
    });

    const filter = (action) => {
      let payload;

      // Date session
      if (action === "time") {
        payload = {
          search: {
            date_session: date_session.value,
            keyword: keyword.value,
            date: dateSelected.value,
          },
          product_name: type.value,
          inventory_name: inventoryType.value,
        };

        // Filters that do not need format checking/validation
      } else if ("date" || "category") {
        payload = {
          date_gte: fromDate.value,
          date_lte: toDate.value,
          product_name: type.value,
          search: {
            keyword: keyword.value,
            date: dateSelected.value,
          },
          inventory_name: inventoryType.value,
        };
        // Date range
      } else if (action === "dates") {
        btnLoadingState.value = true;

        if (isValidDateRange(fromDate, toDate)) {
          payload = {
            date_gte: fromDate.value,
            date_lte: toDate.value,
            product_name: type.value,
            search: {
              keyword: keyword.value,
              date: dateSelected.value,
            },
            inventory_name: inventoryType.value,
          };
        }
        // For search filter type
      } else {
        payload = {
          date_gte: fromDate.value,
          date_lte: toDate.value,
          product_name: type.value,
          search: {
            keyword: keyword.value,
            date: dateSelected.value,
          },
          inventory_name: inventoryType.value,
        };
      }

      // Merge params available
      if (params.value) {
        payload = {
          ...params.value,
          ...payload,
        };
      }

      // Global access
      SearchedParams.value = payload;

      // Send request
      GetSearchResult({
        endpoint: endPoint.value, // Url endpoint
        params: payload, // Payload to send in api
      }).then((response) => {
        // Run when form is submitted
        let status = Boolean(response.status === 200);
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: `${
            status ? "my-success-notif" : "my-error-notif"
          } q-px-lg q-pt-none q-pb-none`,
          html: true,
          message: status
            ? `<div class="text-bold">Search results - ${
                response.data.results
                  ? response.data.results.length
                  : response.data.length
              }</div>`
            : `<div class="text-bold">Failed!</div> ${response.message}.`,
        });
        btnLoadingState.value = false;
      });
    };

    // Filter using date range
    const formDateRange = ref(null);

    const submitDateRange = () => {
      formDateRange.value.validate().then((success) => {
        if (success) {
          filter("dates");
        }
      });
    };

    // Filter using single date
    watch(dateSelected, () => {
      dateSelected.value && filter("date");
    });

    // Filter using keyword
    const searchKeyword = () => {
      keyword.value && filter("search");
    };

    // When close icon is clicked, this removes user input
    const fetchAll = () => {
      keyword.value = null;
    };

    // Check date range filter if valid
    /* This defensive programming will limit the error obtained when:
    - fromDate or toDate is null; and
    - fromDate is much later than toDate */
    const isValidDateRange = (fromDate, toDate) => {
      if (fromDate.value > toDate.value) {
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: "my-error-notif q-px-lg q-pt-none q-pb-none",
          html: true,
          message: '<div class="text-bold">Invalid Date Range!</div>',
        });
        return false;
      }
      return true;
    };

    // dynamicInventoryTypeOptions

    // Define dynamic options based on the value of inventoryType
    const dynamicInventoryTypeOptions = computed(() => {
      if (inventoryType.value === "Books") {
        return [
          {
            label: "21st Century Literature",
            value: "21st Century Literature",
          },
          { label: "Analytic Geometry", value: "Analytic Geometry" },
          { label: "Art Appreciation", value: "Art Appreciation" },
          {
            label: "Babasahin Hinggil sa Kasaysayan",
            value: "Babasahin Hinggil sa Kasaysayan",
          },
          {
            label: "Brunner & Suddarth's TB MS Nursing",
            value: "Brunner & Suddarth's TB MS Nursing",
          },
          {
            label: "Brunner & Suddarth's TB MS Nursing",
            value: "Brunner & Suddarth's TB MS Nursing",
          },
          {
            label: "Communicate Today: English",
            value: "Communicate Today: English",
          },
          {
            label: "Communicate Today: EAPP for SHS",
            value: "Communicate Today: EAPP for SHS",
          },
          {
            label: "Communication in Multicultural Context",
            value: "Communication in Multicultural Context",
          },
          {
            label: "CvSU Form Style for Narrative",
            value: "CvSU Form Style for Narrative",
          },
          {
            label: "CvSU Form Style for Thesis",
            value: "CvSU Form Style for Thesis",
          },
          {
            label: "CvSU Manual for Case Study",
            value: "CvSU Manual for Case Study",
          },
          {
            label: "Dalumat ng mga Filipino",
            value: "Dalumat ng mga Filipino",
          },
          {
            label: "Data Communication G",
            value: "Data Communication G",
          },
          { label: "E-MATH 7", value: "E-MATH 7" },
          { label: "E-MATH 8", value: "E-MATH 8" },
          { label: "E-MATH 9", value: "E-MATH 9" },
          { label: "E-MATH 10", value: "E-MATH 10" },
          { label: "ECAS KTO12 GRD 7", value: "ECAS KTO12 GRD 7" },
          { label: "ECAS KTO12 GRD 8", value: "ECAS KTO12 GRD 8" },
          { label: "ECAS KTO12 GRD 9", value: "ECAS KTO12 GRD 9" },
          { label: "ECAS KTO12 GRD 10", value: "ECAS KTO12 GRD 10" },
          { label: "Environ. Science", value: "Environ. Science" },
          {
            label: "Esteban and Gonzales' Textbook of Histology",
            value: "Esteban and Gonzales' Textbook of Histology",
          },
          { label: "Ethics", value: "Ethics" },
          { label: "Gen. Biology 1", value: "Gen. Biology 1" },
          { label: "Gen. Chemistry 1", value: "Gen. Chemistry 1" },
          { label: "Gen. Mathematics", value: "Gen. Mathematics" },
          { label: "Gen. Physics 1", value: "Gen. Physics 1" },
          { label: "Gender & Society", value: "Gender & Society" },
          {
            label: "Globalisasyon",
            value: "Globalisasyon",
          },
          {
            label: "Globalisasyon sa Kasalukuyan",
            value: "Globalisasyon sa Kasalukuyan",
          },
          { label: "Humanities 6", value: "Humanities 6" },
          { label: "Humanities/Marcos", value: "Humanities/Marcos" },
          { label: "Income Taxation", value: "Income Taxation" },
          {
            label: "Introduction to Phil. G",
            value: "Introduction to Phil. G",
          },
          {
            label: "Koizer & Erb's Fundamental of Nursing",
            value: "Koizer & Erb's Fundamental of Nursing",
          },
          {
            label: "Kontekswalisadong Komunikasyon",
            value: "Kontekswalisadong Komunikasyon",
          },
          { label: "Life & Works of Rizal", value: "Life & Works of Rizal" },
          {
            label: "MAPEH 7",
            value: "MAPEH 7",
          },
          {
            label: "MAPEH 8",
            value: "MAPEH 8",
          },
          {
            label: "MAPEH 9",
            value: "MAPEH 9",
          },
          {
            label: "MAPEH 10",
            value: "MAPEH 10",
          },
          {
            label: "Masining na Pagpapahayag",
            value: "Masining na Pagpapahayag",
          },
          {
            label: "Maternal & Child Health Nursing",
            value: "Maternal & Child Health Nursing",
          },
          {
            label: "Mathematics in the Modern World",
            value: "Mathematics in the Modern World",
          },
          {
            label: "Nursing 2022 Drug Handbook",
            value: "Nursing 2022 Drug Handbook",
          },
          {
            label: "Nursing 2023 Drug Handbook",
            value: "Nursing 2023 Drug Handbook",
          },
          {
            label: "Nurse Educator",
            value: "Nurse Educator",
          },
          {
            label: "Nurses Pocket Guide: Diagnoses Blue",
            value: "Nurses Pocket Guide: Diagnoses Blue",
          },
          {
            label: "Nurses Pocket Guide: Diagnoses Green",
            value: "Nurses Pocket Guide: Diagnoses Green",
          },
          {
            label: "Nurses Pocket Guide: DPIR",
            value: "Nurses Pocket Guide: DPIR",
          },
          {
            label: "Nursing Theorists and Their Work",
            value: "Nursing Theorists and Their Work",
          },
          { label: "Panitikan", value: "Panitikan" },
          { label: "Paano Magpakatao 7", value: "Paano Magpakatao 7" },
          { label: "Paano Magpakatao 8", value: "Paano Magpakatao 8" },
          { label: "Paano Magpakatao 9", value: "Paano Magpakatao 9" },
          { label: "Paano Magpakatao 10", value: "Paano Magpakatao 10" },
          { label: "Phil. Contemp Arts", value: "Phil. Contemp Arts" },
          {
            label: "Practical Research 1 for Senior High School",
            value: "Practical Research 1 for Senior High School",
          },
          { label: "Practical Research 2", value: "Practical Research 2" },
          { label: "Pre-Calculus", value: "Pre-Calculus" },
          { label: "Programming Essen. G", value: "Programming Essen. G" },
          { label: "Punla 7", value: "Punla 7" },
          { label: "Punla 8", value: "Punla 8" },
          { label: "Punla 9", value: "Punla 9" },
          { label: "Punla 10", value: "Punla 10" },
          {
            label: "Science Link 7",
            value: "Science Link 7",
          },
          {
            label: "Science Link 8",
            value: "Science Link 8",
          },
          {
            label: "Science Link 9",
            value: "Science Link 9",
          },
          {
            label: "Science Link 10",
            value: "Science Link 10",
          },
          {
            label: "Science & Technology & Society",
            value: "Science & Technology & Society",
          },
          {
            label: "Sidhaya 11: KPWKP",
            value: "Sidhaya 11: KPWKP",
          },
          { label: "Sosyedad at Literatura", value: "Sosyedad at Literatura" },
          { label: "The World Masterpieces", value: "The World Masterpieces" },
          { label: "Ugnayan at Kaunlaran", value: "Ugnayan at Kaunlaran" },
          {
            label: "Understanding Culture, Society, & Politics",
            value: "Understanding Culture, Society, & Politics",
          },
          { label: "Understanding the Self", value: "Understanding the Self" },
          { label: "Workbook in Logic", value: "Workbook in Logic" },
        ];
      } else if (inventoryType.value === "Uniforms") {
        return [
          { label: "COLLEGE: BLOUSE - XS", value: "COLLEGE: BLOUSE - XS" },
          { label: "COLLEGE: BLOUSE - S", value: "COLLEGE: BLOUSE - S" },
          { label: "COLLEGE: BLOUSE - M", value: "COLLEGE: BLOUSE - M" },
          { label: "COLLEGE: BLOUSE - L", value: "COLLEGE: BLOUSE - L" },
          { label: "COLLEGE: BLOUSE - XL", value: "COLLEGE: BLOUSE - XL" },
          { label: "COLLEGE: BLOUSE - 2XL", value: "COLLEGE: BLOUSE - 2XL" },
          { label: "COLLEGE: BLOUSE - 3XL", value: "COLLEGE: BLOUSE - 3XL" },
          { label: "COLLEGE: BLOUSE - 4XL", value: "COLLEGE: BLOUSE - 4XL" },
          { label: "COLLEGE: BLOUSE - 5XL", value: "COLLEGE: BLOUSE - 5XL" },
          { label: "COLLEGE: BLOUSE - 6XL", value: "COLLEGE: BLOUSE - 6XL" },

          { label: "COLLEGE: SLACKS - S", value: "COLLEGE: SLACKS - S" },
          { label: "COLLEGE: SLACKS - M", value: "COLLEGE: SLACKS - M" },
          { label: "COLLEGE: SLACKS - L", value: "COLLEGE: SLACKS - L" },
          { label: "COLLEGE: SLACKS - XL", value: "COLLEGE: SLACKS - XL" },
          { label: "COLLEGE: SLACKS - 2XL", value: "COLLEGE: SLACKS - 2XL" },
          { label: "COLLEGE: SLACKS - 3XL", value: "COLLEGE: SLACKS - 3XL" },
          { label: "COLLEGE: SLACKS - 4XL", value: "COLLEGE: SLACKS - 4XL" },
          { label: "COLLEGE: SLACKS - 5XL", value: "COLLEGE: SLACKS - 5XL" },
          { label: "COLLEGE: SLACKS - 6XL", value: "COLLEGE: SLACKS - 6XL" },

          { label: "COLLEGE: POLO - XS", value: "COLLEGE: POLO - XS" },
          { label: "COLLEGE: POLO - S", value: "COLLEGE: POLO - S" },
          { label: "COLLEGE: POLO - M", value: "COLLEGE: POLO - M" },
          { label: "COLLEGE: POLO - L", value: "COLLEGE: POLO - L" },
          { label: "COLLEGE: POLO - XL", value: "COLLEGE: POLO - XL" },
          { label: "COLLEGE: POLO - 2XL", value: "COLLEGE: POLO - 2XL" },
          { label: "COLLEGE: POLO - 3XL", value: "COLLEGE: POLO - 3XL" },
          { label: "COLLEGE: POLO - 4XL", value: "COLLEGE: POLO - 4XL" },
          { label: "COLLEGE: POLO - 5XL", value: "COLLEGE: POLO - 5XL" },
          { label: "COLLEGE: POLO - 6XL", value: "COLLEGE: POLO - 6XL" },

          {
            label: "COLLEGE: PE T-SHIRT - XS",
            value: "COLLEGE: PE T-SHIRT - XS",
          },
          {
            label: "COLLEGE: PE T-SHIRT - S",
            value: "COLLEGE: PE T-SHIRT - S",
          },
          {
            label: "COLLEGE: PE T-SHIRT - M",
            value: "COLLEGE: PE T-SHIRT - M",
          },
          {
            label: "COLLEGE: PE T-SHIRT - L",
            value: "COLLEGE: PE T-SHIRT - L",
          },
          {
            label: "COLLEGE: PE T-SHIRT - XL",
            value: "COLLEGE: PE T-SHIRT - XL",
          },
          {
            label: "COLLEGE: PE T-SHIRT - 2XL",
            value: "COLLEGE: PE T-SHIRT - 2XL",
          },
          {
            label: "COLLEGE: PE T-SHIRT - 3XL",
            value: "COLLEGE: PE T-SHIRT - 3XL",
          },

          { label: "COLLEGE: PE SHORT - XS", value: "COLLEGE: PE SHORT - XS" },
          { label: "COLLEGE: PE SHORT - S", value: "COLLEGE: PE SHORT - S" },
          { label: "COLLEGE: PE SHORT - M", value: "COLLEGE: PE SHORT - M" },
          { label: "COLLEGE: PE SHORT - L", value: "COLLEGE: PE SHORT - L" },
          { label: "COLLEGE: PE SHORT - XL", value: "COLLEGE: PE SHORT - XL" },

          { label: "COLLEGE: NSTP - S", value: "COLLEGE: NSTP - S" },
          { label: "COLLEGE: NSTP - M", value: "COLLEGE: NSTP - M" },
          { label: "COLLEGE: NSTP - L", value: "COLLEGE: NSTP - L" },
          { label: "COLLEGE: NSTP - XL", value: "COLLEGE: NSTP - XL" },
          { label: "COLLEGE: NSTP - 2XL", value: "COLLEGE: NSTP - 2XL" },
          { label: "COLLEGE: NSTP - 3XL", value: "COLLEGE: NSTP - 3XL" },
          { label: "COLLEGE: NSTP - 4XL", value: "COLLEGE: NSTP - 4XL" },
          { label: "COLLEGE: NSTP - 5XL", value: "COLLEGE: NSTP - 5XL" },
          { label: "COLLEGE: NSTP - 6XL", value: "COLLEGE: NSTP - 6XL" },

          { label: "JHS: PE T-SHIRT - XS", value: "JHS: PE T-SHIRT - XS" },
          { label: "JHS: PE T-SHIRT - S", value: "JHS: PE T-SHIRT - S" },
          { label: "JHS: PE T-SHIRT - M", value: "JHS: PE T-SHIRT - M" },
          { label: "JHS: PE T-SHIRT - L", value: "JHS: PE T-SHIRT - L" },
          { label: "JHS: PE T-SHIRT - XL", value: "JHS: PE T-SHIRT - XL" },
          { label: "JHS: PE T-SHIRT - 2XL", value: "JHS: PE T-SHIRT - 2XL" },
          { label: "JHS: PE T-SHIRT - 3XL", value: "JHS: PE T-SHIRT - 3XL" },

          { label: "JHS: PE SHORT - XS", value: "JHS: PE SHORT - XS" },
          { label: "JHS: PE SHORT - S", value: "JHS: PE SHORT - S" },
          { label: "JHS: PE SHORT - M", value: "JHS: PE SHORT - M" },
          { label: "JHS: PE SHORT - L", value: "JHS: PE SHORT - L" },
          { label: "JHS: PE SHORT - XL", value: "JHS: PE SHORT - XL" },

          { label: "SHS: PE T-SHIRT - XS", value: "SHS: PE T-SHIRT - XS" },
          { label: "SHS: PE T-SHIRT - S", value: "SHS: PE T-SHIRT - S" },
          { label: "SHS: J. PANTS - XS", value: "SHS: J. PANTS - XS" },
          { label: "SHS: J. PANTS - S", value: "SHS: J. PANTS - S" },
          { label: "SHS: J. PANTS - M", value: "SHS: J. PANTS - M" },
        ];
      } else if (inventoryType.value === "Pajahs") {
        return [
          { label: "PHD (New)", value: "PHD (New)" },
          { label: "PHD (Used)", value: "PHD (Used)" },
          { label: "Masteral (New)", value: "Masteral (New)" },
          { label: "Masteral (Used)", value: "Masteral (Used)" },
          {
            label: "Extra Large Student Pajah (New)",
            value: "Extra Large Student Pajah (New)",
          },
          {
            label: "Extra Large Student Pajah (Used)",
            value: "Extra Large Student Pajah (Used)",
          },
          {
            label: "Large Student Pajah (New)",
            value: "Large Student Pajah (New)",
          },
          {
            label: "Large Student Pajah (Used)",
            value: "Large Student Pajah (Used)",
          },
          { label: "Small (New)", value: "Small (New)" },
          { label: "Small (Used)", value: "Small (Used)" },
          { label: "Medium (New)", value: "Medium (New)" },
          { label: "Medium (Used)", value: "Medium (Used)" },
          { label: "Large (New)", value: "Large (New)" },
          { label: "Large (Used)", value: "Large (Used)" },
        ];
      } else {
        return []; // Return an empty array if no options match
      }
    });

    // const data = ref({
    //   file1: "",
    //   file2: "",
    //   popup_show: {
    //     file1: false,
    //     file2: false,
    //   },
    // });

    return {
      DarkMode,
      fromDate,
      toDate,
      date_session,
      filter,
      btnLoadingState,
      type,
      keyword,
      isSelectForSalesPgVisible,
      isSearchVisible,
      isFilterDateVisible,
      optionsForSalesPg,
      dateOptions,
      isLabelVisible,
      isDateRangeVisible,
      formDateRange,
      submitDateRange,
      dateSelected,
      searchKeyword,
      fetchAll,
      dynamicInventoryTypeOptions,
    };
  },
};
</script>

<style lang="scss">
.filters-component {
  .minmax-width {
    min-width: 144px;
    max-width: 144px;
    @media screen and (min-width: $breakpoint-sm-max) {
      // min-width: 190px;
      // max-width: 190px;
      min-width: 144px;
      max-width: 144px;
    }
  }

  .minmax-width-190 {
    min-width: 190px;
    max-width: 190px;
  }
}

.filter-date-field {
  height: 30px;
  .q-field__control,
  .q-field__marginal {
    height: 30px;
  }
}
</style>
