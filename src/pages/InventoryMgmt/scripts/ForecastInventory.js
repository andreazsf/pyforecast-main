import { ref, onMounted } from "vue";
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
import {
  FetchForecastData,
  FetchForecastHistory,
  AddForecastHistory,
} from "../../../server/index";
import html2pdf from "html2pdf.js";
import { SearchedParams } from "../../../composables/SearchForInventory";
import { useQuasar } from "quasar";

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
  components: {
    LineChart: Line,
  },

  setup() {
    const $q = useQuasar(); // q

    const forecastX = ref([]);
    const forecastY = ref([]);
    const labels = ref([]);
    const datasets = ref([]);

    const mseErrorValue = ref("");
    const rsquaredErrorValue = ref("");

    const productName = ref("");
    const inventoryType = ref("");

    const isThereSearchedParams = () => {
      if (SearchedParams.value === null) {
        productName.value = "OBRG";
      } else {
        inventoryType.value = SearchedParams.value.inventory_name;
        productName.value = SearchedParams.value.product_name;
      }
    };

    // Function to round off the value to 2 decimal places
    const roundValue = (value) => {
      return Math.round(value);
    };

    onMounted(async () => {
      // Checks if there is a filter applied on prior pg
      isThereSearchedParams();

      try {
        // Fetch forecasted data
        const forecastedData = await FetchForecastData("forecast", {
          endpoint: "",
          params: "",
        });

        // Clear previous data

        forecastX.value = [];
        forecastY.value = [];

        // Populate forecastX and forecastY arrays
        forecastedData.forEach((item) => {
          forecastX.value.push(item.months); // Array of months
          forecastY.value.push(item.target); // Array of quantity_sold and updates values to whole numbers.
          mseErrorValue.value = item.mse;
          rsquaredErrorValue.value = item.r_squared.toFixed(2);
        });

        // Log forecastedY data array
        // console.log("ForecastedY:", forecastY.value);

        // Update chart data after fetching
        updateChartData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    const updateChartData = () => {
      labels.value = forecastX.value.flat(); // Flatten the nested arrays if needed
      const quantityData = forecastY.value.flat(); // Flatten the nested arrays if needed
      const dataLength = quantityData.length;

      datasets.value = [
        {
          label: "Quantity",
          data: quantityData,
          fill: false,
          borderColor: "#FFB200",
          pointBackgroundColor: Array(dataLength).fill("#FFB200"), // Set all points to #FFB200 initially
          pointBorderColor: Array(dataLength).fill("#FFB200"),
          pointRadius: 5,
          tension: 0.1,
        },
      ];

      // Set different color for the last three data points
      if (dataLength > 0) {
        const lastThreeDataPointsIndices = [
          dataLength - 3,
          dataLength - 2,
          dataLength - 1,
        ];

        // Set different color for the last three data points
        lastThreeDataPointsIndices.forEach((index) => {
          datasets.value[0].pointBackgroundColor[index] = "#4339F2";
          datasets.value[0].pointBorderColor[index] = "#4339F2";
          datasets.value[0].data[index] = roundValue(
            datasets.value[0].data[index]
          );
        });
      }
    };

    //Options for Chart
    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: "Poppins",
            },
          },
        },
      },
    });

    ChartJS.defaults.font.family = "Poppins";

    // Rows and columns for the tabulated data report
    let rows = ref([]);
    let columns = [
      {
        name: "month",
        required: true,
        label: "Dates",
        align: "left",
        field: (row) => row.month,
        sortable: true,
        headerStyle: "text-align: center; padding-left: 16px",
        style: "font-weight: normal; text-align: center;",
      },
      {
        name: "target",
        label: "Quantity",
        field: (row) => roundValue(row.target),
        sortable: true,
        headerStyle: "text-align: center; padding-right: 16px",
        style: "font-weight: normal; text-align: center;",
      },
    ];

    // Fetch forecasted data from the db
    FetchForecastData("forecast", {
      endpoint: "",
      params: "",
    })
      .then((response) => {
        if (response && response.length > 0) {
          // Assuming 'months' and 'target' are parallel arrays of the same length
          const months = response[0].months;
          const targets = response[0].target;

          if (months && targets && months.length === targets.length) {
            // Map each month to its corresponding target
            const tableData = months.map((month, index) => {
              return {
                month: month, // Month value
                target: targets[index], // Corresponding target value
              };
            });

            // Set tableData to value of rows array ref
            rows.value = tableData;
          } else {
            // Error handler
            // console.error(
            //   "Months and targets are not correctly formatted."
            // );
          }
        } else {
          console.error("Invalid or empty response:", response);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch forecast data:", error);
      });

    const isButtonClicked = ref(false);

    const exportToPDF = () => {
      // Loading component
      $q.loading.show({
        message:
          "<b>Downloading</b> report.<br/><span class='text-italic'>Please wait...</span>",
        html: true,
        boxClass: "bg-white text-black rounded-borders q-pa-xl",
        spinnerColor: "primary",
      });

      // Processes to generate report to download
      isButtonClicked.value = true;
      const element = document.getElementById("element-to-convert");

      if (element) {
        // Start the conversion process for the first page
        html2pdf()
          .set({
            margin: [0.5, 0.1, 0.5, 0.1],
            filename: "ForecastReport.pdf",
            pageBreak: { mode: "css" },
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
              dpi: 300,
              letterRendering: true,
            },
            jsPDF: { unit: "in", format: "legal", orientation: "landscape" },
          })
          .from(element)
          .toPdf()
          .save()
          .then(() => {
            setTimeout(() => {
              $q.loading.hide(); // Hide loading indicator
              isButtonClicked.value = false;
            }, 1000);
          })
          .catch((error) => {
            console.error("Failed to generate PDF: ", error);
          });
      } else {
        console.error("Element not found.");
      }

      // Function to add a forecast history,
      // Every after report is downloaded
      FetchForecastHistory("forecasthistories", {
        endpoint: "",
        params: "",
      }).then((response) => {
        // Fetch items, length + 1 to set the new id
        let newId = response.length + 1;

        // Fetch forecast values
        FetchForecastData("forecast", {
          endpoint: "",
          params: "",
        }).then((response) => {
          // Get today's creation date
          const today = new Date();
          const yyyy = today.getFullYear(); // Get year

          // Get month (MM), leading zero (e.g., 01-24)
          let mm = today.getMonth() + 1; // Month starts at 0
          mm = mm.toString().length === 1 ? `0${mm}` : mm;
          const formattedDate = `${mm}-${yyyy}`; // Combine and format date

          const tempData = response[0];

          // Gets forecasted months through last 3 items in the array
          const monthsLength = tempData.months.length;
          const forecastedMonths = [
            tempData.months[monthsLength - 3],
            tempData.months[monthsLength - 2],
            tempData.months[monthsLength - 1],
          ];

          // Gets forecasted values through last 3 items in the array
          const forecastedValues = [
            roundValue(tempData.target[monthsLength - 3]),
            roundValue(tempData.target[monthsLength - 2]),
            roundValue(tempData.target[monthsLength - 1]),
          ];

          // Equates form values
          const dataHistory = {
            id: newId,
            report_type: tempData.report_type,
            category_name: tempData.category_name,
            date: formattedDate,
            range_start: tempData.range_start,
            range_end: tempData.range_end,
            forecast_dates: forecastedMonths,
            forecasted_values: forecastedValues,
          };

          AddForecastHistory(dataHistory);
        });
      });
    };

    return {
      labels,
      datasets,
      options,
      mseErrorValue,
      rsquaredErrorValue,
      productName,
      forecastX,
      forecastY,
      roundValue,
      rows,
      columns,
      isButtonClicked,
      exportToPDF,
    };
  },
};
