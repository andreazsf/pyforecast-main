import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, LocalStorage } from "quasar";
// import { Search, currentRows } from "../../../server/index";
import Filters from "../../../components/FiltersComp.vue";
import Pagination from "../../../components/PaginationComp.vue";
import { Search, currentRows } from "../../../composables/SearchForForecasts";
import html2pdf from "html2pdf.js";

// fetch sales data from db
import {
  FetchForecastHistory,
  DeleteForecastHistory,
} from "../../../server/index";

export default {
  components: {
    Filters,
    Pagination,
  },
  methods: {
    formatDate(value) {
      // Parse the input value as MM/YYYY
      const [month, year] = value.split("-");
      // Set the selectedDate to the first day of the month in YYYY-MM-DD format
      this.selectedDate = `${year}-${month.padStart(2, "0")}-01`;
    },
  },
  setup() {
    onMounted(() => {
      // Fetch data for the table
      FetchForecastHistory("forecasthistories", {
        endpoint: "",
        params: "",
      }).then((response) => {
        rows.value = response;
        Search.value = rows.value.slice(0, pagination.value.rowsPerPage);
      });
    });

    const router = useRouter(); // Router
    const $q = useQuasar(); // q

    let rows = ref([]); // Rows

    // Column Headers
    const columns = [
      {
        name: "id",
        field: "id",
        label: "Report ID",
        align: "center",
        sortable: true,
        headerStyle: "text-align: center; padding-left: 16px",
        style: "font-weight: normal; text-align: center;",
      },
      {
        name: "reportType",
        field: "report_type",
        label: "Report Type",
        align: "left",
        sortable: true,
        style: "font-weight: normal;",
      },
      {
        name: "unitProductName",
        field: "category_name",
        label: "Unit or Product Name",
        align: "left",
        sortable: true,
        style: "font-weight: normal;",
      },
      {
        name: "dateCreated",
        field: "date",
        label: "Date Created",
        align: "center",
        sortable: true,
        style: "font-weight: normal; padding-right: 16px",
      },
      {
        name: "dateRange",
        field: (row) => row.range_start + " – " + row.range_end,
        label: "Report Date Range",
        align: "center",
        sortable: true,
        headerStyle: "padding-left: 16px",
        style: "font-weight: normal;",
      },
      {
        name: "forecastDates",
        field: "forecast_dates",
        format: (val) => {
          if (Array.isArray(val)) {
            return val.map((date) => `${date}`).join("\n");
          } else {
            return "";
          }
        },
        label: "Forecast Dates",
        align: "center",
        sortable: false,
        style: "font-weight: normal; white-space: pre-wrap;",
        formatHtml: true,
      },
      {
        name: "forecastedValues",
        field: "forecasted_values",
        format: (val) => {
          if (Array.isArray(val)) {
            return val.map((values) => `${values}`).join("\n");
          } else {
            return "";
          }
        },
        label: "Predicted Values",
        align: "center",
        sortable: false,
        style:
          "font-weight: normal; white-space: pre-wrap; min-width: 176px !important;",
      },
      {
        name: "actions",
        label: "Action",
        align: "center",
        field: "actions",
        headerStyle: "text-align: left;",
        style: "text-align: center; width: 80px !important;",
      },
    ];

    // Pagination
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 4,
    });

    /*  This function updates the row data in the column whenever called.
        It updates the startIndex and endIndex and then proceed with updating the currentRows or Search.
        currentRows/Search are the rows shown in the table. */

    const updatePagination = () => {
      const startIndex =
        (pagination.value.page - 1) * pagination.value.rowsPerPage;
      const endIndex = startIndex + pagination.value.rowsPerPage;
      Search.value = rows.value.slice(startIndex, endIndex); // endIndex is exclusive
    };

    // Function to update rowsPerPage according to the length of rows
    const showAllRows = () => {
      pagination.value.rowsPerPage = rows.value.length;
      updatePagination(); // Call the function to update the pagination
    };

    // Reference variable for the row to delete
    const rowToDelete = ref({
      id: null,
      unitName: "",
      totalSales: null,
      date: "",
    });

    // Function to remember the row values when delete button is clicked
    const rememberRowToDelete = (row) => {
      // Copy the row values to the reactive variable
      rowToDelete.value.id = row._id;
      rowToDelete.value.subId = row.id;
    };

    // Function to delete the record
    const deleteRecord = () => {
      // Perform delete operation using the rowToDelete
      DeleteForecastHistory({ _id: rowToDelete.value.id });

      // Post notification on lower right side of the page
      $q.notify({
        position: $q.screen.width < 767 ? "top" : "bottom-right",
        classes: `my-success-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
        html: true,
        message: `<div class="text-bold">Record deleted successfully!</div> Record No. ${rowToDelete.value.subId} has been deleted.`,
      });

      setTimeout(() => {
        // Update table data after deleting
        FetchForecastHistory("forecasthistories", {
          endpoint: "",
          params: "",
        }).then((response) => {
          rows.value = response;
          updatePagination();
        });
      }, 500);
    };

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

      isButtonClicked.value = true;
      const element = document.getElementById("element-to-convert");

      if (element) {
        // Start the conversion process for the first page
        html2pdf()
          .set({
            margin: [0.5, 0.1, 0.5, 0.1],
            filename: "ForecastHistory.pdf",
            pageBreak: { mode: "css" },
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
              dpi: 300,
              letterRendering: true,
            },
            jsPDF: {
              unit: "in",
              format: "legal",
              orientation: "landscape",
            },
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
            $q.loading.hide(); // Hide loading indicator
            console.error("Failed to generate PDF: ", error);
          });
      } else {
        console.error("Element not found.");
        $q.loading.hide(); // Hide loading indicator
      }
    };

    const loading = ref(false);
    const userType = LocalStorage.getItem("userSession");
    const checkIfAdmin = Boolean(userType.isAdmin === true);

    return {
      Search,
      currentRows,
      router,
      rows,
      columns,
      pagination,
      updatePagination,
      showAllRows,
      rememberRowToDelete,
      deleteRecord,
      loading,
      checkIfAdmin,
      exportToPDF,
      isButtonClicked,

      // References
      deleteRecordDialog: ref(false),
    };
  },
};
