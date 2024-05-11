<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <q-page class="flex flex-center bg-white">
      <q-scroll-area
        class="absolute fit q-pt-md"
        :thumb-style="
          $q.screen.width <= 820
            ? {
                background: 'transparent',
                opacity: 0,
              }
            : {}
        "
      >
        <transition
          appear
          enter-active-class="animated fadeIn delay-7s"
          leave-active-class="animated fadeOut"
          :duration="7000"
        >
          <div class="full-width q-px-lg">
            <!-- Header -->
            <div flat>
              <div class="text-h3">
                Welcome, {{ currentUserInfo.user_type }}!
              </div>
              <p class="text-grey-6 q-mt-sm">
                Here's your summary sales of data.
              </p>
            </div>

            <!-- Cards -->
            <div
              class="q-gutter-md q-pt-md justify-center"
              :class="$q.screen.width <= 820 ? 'col q-gutter-lg' : 'row'"
            >
              <q-card
                clickable
                flat
                class="my-card bg-grey-2 rounded-borders clickable"
                @click="
                  router.push({
                    name: 'inventory-mgmt',
                    params: { inventory_name: books },
                  });
                  linkActive = '/forecast-history';
                "
              >
                <q-card-section>
                  <div class="text-subtitle2 text-primary">Books</div>
                  <!-- <div class="text-h6">30,000</div> -->
                  <div
                    class="text-h6 block"
                    v-if="calculatedTotalSales.totalSalesOfBooks != ''"
                  >
                    {{ calculatedTotalSales.totalSalesOfBooks }}
                  </div>
                  <div v-else>
                    <q-spinner-ios
                      class="text-grey-9 q-mt-sm q-mb-xs"
                      size="1.5em"
                    />
                  </div>
                  <q-item-label caption class="text-right">
                    <q-icon
                      name="import_contacts"
                      class="material-symbols-outlined"
                      size="xs"
                    />
                  </q-item-label>
                </q-card-section>
              </q-card>
              <q-card
                clickable
                flat
                class="my-card bg-grey-2 rounded-borders clickable"
                @click="
                  router.push({
                    name: 'inventory-mgmt',
                    params: { inventory_name: uniforms },
                  });
                  linkActive = '/forecast-history';
                "
              >
                <q-card-section>
                  <div class="text-subtitle2 text-primary">Uniform</div>
                  <div
                    class="text-h6 block"
                    v-if="calculatedTotalSales.totalSalesOfUniforms != ''"
                  >
                    {{ calculatedTotalSales.totalSalesOfUniforms }}
                  </div>
                  <div v-else>
                    <q-spinner-ios
                      class="text-grey-9 q-mt-sm q-mb-xs"
                      size="1.5em"
                    />
                  </div>
                  <q-item-label caption class="text-right">
                    <q-icon
                      name="checkroom"
                      class="material-symbols-outlined"
                      size="xs"
                    />
                  </q-item-label>
                </q-card-section>
              </q-card>
              <q-card
                clickable
                flat
                class="my-card bg-grey-2 rounded-borders clickable"
                @click="
                  router.push({
                    name: 'inventory-mgmt',
                    params: { inventory_name: pajahs },
                  });
                  linkActive = '/forecast-history';
                "
              >
                <q-card-section>
                  <div class="text-subtitle2 text-primary">Pajah</div>
                  <div
                    class="text-h6 block"
                    v-if="calculatedTotalSales.totalSalesOfPajahs != ''"
                  >
                    {{ calculatedTotalSales.totalSalesOfPajahs }}
                  </div>
                  <div v-else>
                    <q-spinner-ios
                      class="text-grey-9 q-mt-sm q-mb-xs"
                      size="1.5em"
                    />
                  </div>
                  <q-item-label caption class="text-right">
                    <q-icon
                      name="school"
                      class="material-symbols-outlined"
                      size="xs"
                    />
                  </q-item-label>
                </q-card-section>
              </q-card>
              <q-card
                clickable
                flat
                class="bg-grey-2 rounded-borders clickable hidden"
                style="min-width: 120px"
              >
                <q-card-section>
                  <div class="text-subtitle2 text-primary">Other</div>
                  <div class="text-h6 text-transparent">.</div>
                  <q-item-label caption class="text-right">
                    <q-icon
                      name="add"
                      class="material-symbols-outlined"
                      size="xs"
                    />
                  </q-item-label>
                </q-card-section>
              </q-card>
            </div>

            <!-- Line Chart -->
            <div class="q-py-xl flex flex-center">
              <LineChart
                v-if="labels.length && datasets.length"
                :data="{ labels, datasets }"
                :options="options"
                style="width: 100% !important; height: 56vh"
                class="q-pl-sm"
              />
              <div v-else>
                <q-spinner-dots class="text-primary" size="1.5em" />
              </div>
              <br />
            </div>
          </div>
        </transition>
      </q-scroll-area>
    </q-page>
  </transition>
</template>

<script>
import { ref, onMounted } from "vue";
import { FetchInventoryData, FetchSalesData } from "src/server";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import { LocalStorage } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { linkActive } from "../composables/References";

// Define variables for chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "DashboardPg",
  components: {
    LineChart: Line,
  },
  setup() {
    const forecastX = ref([]);
    const forecastY = ref([]);

    const labels = ref([]);
    const datasets = ref([]);

    let SearchBooks = ref([]);
    let SearchUniforms = ref([]);
    let SearchPajahs = ref([]);
    let SearchSales = ref([]);

    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);

    onMounted(async () => {
      try {
        // COUNTING SALES FOR BOOKS, UNIFORMS, PAJAHS & OVERALL OBRG SALES
        const responseForBooks = await FetchInventoryData("inventory", {
          endpoint: "",
          params: { inventory_name: "Books" },
        });
        const responseForUniforms = await FetchInventoryData("inventory", {
          endpoint: "",
          params: { inventory_name: "Uniforms" },
        });
        const responseForPajahs = await FetchInventoryData("inventory", {
          endpoint: "",
          params: { inventory_name: "Pajahs" },
        });
        const responseForSales = await FetchSalesData("sales", {
          endpoint: "",
          params: "",
        });

        // Assign fetched data to Search*.value
        SearchBooks.value = responseForBooks;
        SearchUniforms.value = responseForUniforms;
        SearchPajahs.value = responseForPajahs;
        SearchSales.value = responseForSales;

        // Calculate total sales
        total.value.totalSalesOfBooks = calculateTotalSales(SearchBooks.value);
        total.value.totalSalesOfUniforms = calculateTotalSales(
          SearchUniforms.value
        );
        total.value.totalSalesOfPajahs = calculateTotalSales(
          SearchPajahs.value
        );

        // Format total sales with commas and leading zeros with comma
        calculatedTotalSales.value.totalSalesOfBooks = formatNumber(
          total.value.totalSalesOfBooks
        );
        calculatedTotalSales.value.totalSalesOfUniforms = formatNumber(
          total.value.totalSalesOfUniforms
        );
        calculatedTotalSales.value.totalSalesOfPajahs = formatNumber(
          total.value.totalSalesOfPajahs
        );
        /* calculatedTotalSales.value.totalSalesOfBooks =
          total.value.totalSalesOfBooks; //Without comma */

        // DATA FOR CHART
        // Populate forecastX and forecastY arrays based on fetched data
        const salesByDate = new Map();

        for (const saleData of responseForSales) {
          const { date, total_sales } = saleData; // Check if the date already exists in the map

          if (salesByDate.has(date)) {
            // If the date exists, add the total_sales to the existing value
            salesByDate.set(date, salesByDate.get(date) + total_sales);
          } else {
            // If the date does not exist, initialize it with the total_sales
            salesByDate.set(date, total_sales);
          }
        }

        // Compares dates, and sort in MM-YYYY format
        const dateComparator = (a, b) => {
          const [monthA, yearA] = a[0].split("-").map(Number);
          const [monthB, yearB] = b[0].split("-").map(Number);
          return yearA - yearB || monthA - monthB; // Compare years first, then months
        };

        // Sort dates
        const sortedSalesByDate = new Map(
          [...salesByDate.entries()].sort(dateComparator)
        );

        // Convert the Map to arrays and populate forecastX and forecastY
        for (const [date, totalSales] of sortedSalesByDate) {
          forecastX.value.push(date);
          forecastY.value.push(totalSales);
        }

        // Update chart data after all processes
        updateChartData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    // Define total variables
    const total = ref({
      totalSalesOfBooks: null,
      totalSalesOfUniforms: 0,
      totalSalesOfPajahs: 0,
    });

    const calculatedTotalSales = ref({
      totalSalesOfBooks: "",
      totalSalesOfUniforms: "",
      totalSalesOfPajahs: "",
    });

    // Define function to calculate total sales
    const calculateTotalSales = (salesData) => {
      let totalSalesOfBooks = 0;
      let totalSalesOfUniforms = 0;
      let totalSalesOfPajahs = 0;
      for (const saleData of salesData) {
        totalSalesOfBooks += parseInt(saleData.total_sales);
        totalSalesOfUniforms += parseInt(saleData.total_sales);
        totalSalesOfPajahs += parseInt(saleData.total_sales);
      }
      return totalSalesOfBooks, totalSalesOfUniforms, totalSalesOfPajahs;
      // Remove this code if no P sign
      // .toLocaleString("en-PH", {
      //   style: "currency",
      //   currency: "PHP",
      // })
      // .split(".")[0]
      // Remove this if no 0.xx
    };

    // Format number with commas and leading zeros
    const formatNumber = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Function to update chart data
    const updateChartData = () => {
      labels.value = forecastX.value;
      datasets.value = [
        {
          label: "Sales",
          data: forecastY.value,
          fill: false,
          borderColor: "#FFB200",
          pointBackgroundColor: "#FFB200", // Set point background color
          pointRadius: 5,
          tension: 0.1,
        },
      ];
    };

    // Data for Chart
    ChartJS.defaults.font.family = "Poppins";
    // const labels = Utils.months({ count: 7 });
    // // Data for Chart
    // const data = ref({
    //   labels: [],
    //   datasets: [
    //     {
    //       label: "Forecasted Sales",
    //       data: [],
    //       fill: false,
    //       borderColor: "#FFB200",
    //       tension: 0.1,
    //     },
    //   ],
    // });

    //Options for Chart
    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false, // Undisplays legends
          labels: {
            font: {
              family: "Poppins",
            },
          },
        },
      },
    });

    const currentUserInfo = LocalStorage.getItem("userData");
    const books = "Books";
    const uniforms = "Uniforms";
    const pajahs = "Pajahs";

    return {
      router,
      calculatedTotalSales,
      labels,
      datasets,
      options,
      currentUserInfo,
      books,
      uniforms,
      pajahs,
      loading,
      linkActive,
    };
  },
};
</script>
