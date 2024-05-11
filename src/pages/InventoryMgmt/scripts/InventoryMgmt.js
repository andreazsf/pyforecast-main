import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, LocalStorage } from "quasar";
// import { Search, currentRows } from "../../../server/index";
import Filters from "../../../components/FiltersForInventory.vue";
import Pagination from "../../../components/PaginationComp.vue";
import {
  Search,
  currentRows,
  SearchedParams,
} from "../../../composables/SearchForInventory";

import { selectedInventoryType } from "../../../composables/References";

// fetch books data from db
import {
  FetchInventory,
  FetchInventoryData,
  AddInventoryData,
  EditInventoryData,
  DeleteInventoryData,
  FetchForecastData,
  AddForecastData,
  ResetForecastData,
  ForecastInventory,
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
    const router = useRouter(); // Router
    const route = useRoute(); // Route
    const $q = useQuasar(); // q

    let link = ref("Books");

    onMounted(() => {
      selectedInventoryType.value = `${route.params.inventory_name}`;
      link.value = `${route.params.inventory_name}`;
      // Fetch data for the table
      FetchInventoryData("inventory", {
        endpoint: "",
        params: { inventory_name: selectedInventoryType.value },
      }).then((response) => {
        rows.value = response;
        Search.value = rows.value.slice(0, pagination.value.rowsPerPage);
      });
    });

    // Rows
    let rows = ref([]);

    // Column Headers
    const columns = [
      {
        name: "id",
        field: "id",
        label: "Item No.",
        align: "center",
        sortable: false,
        headerStyle: "text-align: center;",
        style: "font-weight: normal; text-align: center; min-width: 96px;",
      },
      {
        name: "productName",
        field: "product_name",
        label: "Product Name",
        align: "left",
        sortable: true,
        style: "font-weight: normal;",
      },
      {
        name: "quantitySold",
        field: "quantity_sold",
        label: "Quantity Sold",
        align: "center",
        sortable: false,
        style: "font-weight: normal; text-align: center;",
      },
      {
        name: "totalSales",
        field: "total_sales",
        label: "Total Sales",
        align: "center",
        sortable: false,
        style: "font-weight: normal; text-align: center;",
      },
      {
        name: "date",
        field: "date",
        label: "Date",
        align: "center",
        sortable: true,
        style: "font-weight: normal; text-align: center;",
      },
      {
        name: "actions",
        label: "Action",
        align: "center",
        field: "actions",
        headerStyle: "text-align: left;",
        style: "text-align: center; width: 80px;",
      },
    ];

    // Pagination
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
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
      SearchedParams.value = null; // Sets SearchedParams to default name
      pagination.value.rowsPerPage = rows.value.length;
      updatePagination(); // Call the function to update the pagination
    };

    // Form
    const form = ref({
      id: null,
      inventoryName: "",
      productName: "",
      quantitySold: "",
      totalSales: "",
      date: "",
    });

    // Function to check if form is valid
    const isFormValid = () => {
      return (
        form.value.productName !== "" &&
        form.value.quantitySold !== "" &&
        Boolean(/^\d*$/.test(form.value.quantitySold)) &&
        form.value.totalSales !== "" &&
        Boolean(/^\d*$/.test(form.value.totalSales)) &&
        form.value.date !== ""
      );
    };

    // Function to clear all inputs when cancel is clicked
    const fetchAll = () => {
      form.value.productName = "";
      form.value.quantitySold = "";
      form.value.totalSales = "";
      form.value.date = "";
    };

    // Function to add data
    const addInventoryData = () => {
      /* Counts the accounts first to ensure new id
      in accordance with INT format. */

      FetchInventory().then((response) => {
        let accounts = response;
        let highestId = 0;

        // Find the highest existing ID
        accounts.forEach((account) => {
          if (account.id > highestId) {
            highestId = parseInt(account.id); // Parse ID as integer
          }
        });

        // Increment the ID for the new account
        const newId = highestId + 1;

        // Equates form values
        const data = {
          id: newId,
          inventory_name: selectedInventoryType.value,
          product_name: form.value.productName,
          quantity_sold: Number(form.value.quantitySold),
          total_sales: Number(form.value.totalSales),
          date: form.value.date,
        };

        // Add the new data to the server
        AddInventoryData(data).then((response) => {
          // data.id = newId; // Ensure newId is a number
          // Number(data.quantity_sold);
          // Number(data.total_sales);

          let status = Boolean(response.data !== "undefined");
          $q.notify({
            // Post notification on lower right side
            position: $q.screen.width < 767 ? "top" : "bottom-right",
            classes: `${
              status ? "my-success-notif" : "my-error-notif"
            } q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
            html: true,
            message: status
              ? `<div class="text-bold">Added Succesfully!</div> A new record has been added.`
              : `<div class="text-bold">Failed to add the new record!</div>`,
          });
        });

        // Fetch updated table data
        FetchInventoryData("inventory", {
          endpoint: "",
          params: { inventory_name: selectedInventoryType.value },
        }).then((response) => {
          rows.value = response;
          // Automatically move to the last page where the new record would be
          const totalPages = Math.ceil(
            rows.value.length / pagination.value.rowsPerPage
          );
          pagination.value.page = totalPages;
          updatePagination(); // Make sure to call this to update the view
        });
      });
    };

    /* Method to handle when the row is clicked.
    Prepopulates Edit Input Fields in accordance with the row id */
    const pushAccount = (row) => {
      form.value.id = row._id;
      form.value.productName = row.product_name;
      form.value.quantitySold = row.quantity_sold;
      form.value.totalSales = row.total_sales;
      form.value.date = row.date;
    };

    // Function to Edit Account details
    const editRecord = () => {
      // Equates form values
      const dataToEdit = {
        _id: form.value.id,
        inventory_name: selectedInventoryType.value,
        product_name: form.value.productName,
        quantity_sold: Number(form.value.quantitySold),
        total_sales: Number(form.value.totalSales),
        date: form.value.date,
      };

      // Actually edit details
      EditInventoryData(dataToEdit)
        .then((response) => {
          let status = Boolean(response.data !== "undefined");
          $q.notify({
            // Post notification on lower right side
            position: $q.screen.width < 767 ? "top" : "bottom-right",
            classes: `${
              status ? "my-success-notif" : "my-error-notif"
            } q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
            html: true,
            message: status
              ? `<div class="text-bold">Record was changed succesfully!</div> Record has been updated.`
              : `<div class="text-bold">Failed to update the record!</div>`,
          });
        })
        .finally(() => {
          // Fetch updated table data
          FetchInventoryData("inventory", {
            endpoint: "",
            params: { inventory_name: selectedInventoryType.value },
          }).then((response) => {
            rows.value = response;
            updatePagination();
            fetchAll();
          });
        });
    };

    // Reference variable for the row to delete
    const rowToDelete = ref({
      id: null,
      productName: "",
      quantitySold: null,
      totalSales: null,
      date: "",
    });

    // Function to remember the row values when delete button is clicked
    const rememberRowToDelete = (row) => {
      // Copy the row values to the reactive variable
      rowToDelete.value.id = row._id;
      rowToDelete.value.subId = row.id;
      rowToDelete.value.productName = row.product_name;
      rowToDelete.value.quantitySold = row.quantity_sold;
      rowToDelete.value.totalSales = row.total_sales;
      rowToDelete.value.date = row.date;
    };

    // Function to delete the account
    const deleteRecord = () => {
      // Perform delete operation using the rowToDelete
      DeleteInventoryData({ _id: rowToDelete.value.id });

      // Post notification on lower right side of the page
      $q.notify({
        position: $q.screen.width < 767 ? "top" : "bottom-right",
        classes: `my-success-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
        html: true,
        message: `<div class="text-bold">Record deleted successfully!</div> Record No. ${rowToDelete.value.subId} has been deleted.`,
      });

      // Fetch updated table data
      FetchInventoryData("inventory", {
        endpoint: "",
        params: { inventory_name: selectedInventoryType.value },
      }).then((response) => {
        rows.value = response;
        updatePagination();
      });
    };

    const selectedInventoryForBooks = () => {
      selectedInventoryType.value = "Books";

      // After updating the user type, fetch updated table data
      FetchInventoryData("inventory", {
        endpoint: "",
        params: { inventory_name: selectedInventoryType.value },
      }).then((response) => {
        rows.value = response;
        pagination.value.page = 1;
        updatePagination(); // Make sure to call this to update the view
      });
    };

    const selectedInventoryForUniforms = () => {
      selectedInventoryType.value = "Uniforms";

      // After updating the user type, fetch updated table data
      FetchInventoryData("inventory", {
        endpoint: "",
        params: { inventory_name: selectedInventoryType.value },
      }).then((response) => {
        rows.value = response;
        pagination.value.page = 1;
        updatePagination(); // Make sure to call this to update the view
      });
    };

    const selectedInventoryForPajahs = () => {
      selectedInventoryType.value = "Pajahs";

      // After updating the user type, fetch updated table data
      FetchInventoryData("inventory", {
        endpoint: "",
        params: { inventory_name: selectedInventoryType.value },
      }).then((response) => {
        rows.value = response;
        pagination.value.page = 1;
        updatePagination(); // Make sure to call this to update the view
      });
    };

    const loading = ref(false);

    // Report name reference
    const reportName = ref("");

    const toProcessForecast = async () => {
      // Extract dates and total_sales from rows.value
      Search.value.map((row) => row.date);
      Search.value.map((row) => row.quantity_sold);

      // Create a dictionary to store total sales for each unique date
      const quantityByDate = {};

      Search.value.forEach((row) => {
        const date = row.date;
        const quantitySold = row.quantity_sold;
        if (quantityByDate.hasOwnProperty(date)) {
          quantityByDate[date] += quantitySold;
        } else {
          quantityByDate[date] = quantitySold;
        }
      });

      // Sort dates in MM-YYYY format
      const sortedDates = Object.keys(quantityByDate).sort((a, b) => {
        const [aMonth, aYear] = a.split("-");
        const [bMonth, bYear] = b.split("-");
        return aYear !== bYear ? aYear - bYear : aMonth - bMonth; // compare years, then months
      });

      // Initialize arrays for months and sales
      const months = [];
      const quantityAggregated = [];

      // Iterate over unique dates and add corresponding total sales to arrays
      sortedDates.forEach((date) => {
        months.push(date);
        quantityAggregated.push(quantityByDate[date]);
      });

      // Generate an array of numbers from 1 to the length of the months array
      const monthsId = Array.from(
        { length: months.length },
        (_, index) => index + 1
      );

      // Gets current unit name,
      // If none, sets unit_name to OBRG Sales
      if (SearchedParams.value !== null) {
        reportName.value = SearchedParams.value.product_name;
      } else {
        reportName.value = "OBRG Inventory";
      }

      // Gets end date by getting months array length - 1
      const endDate = months.length - 1;

      // Equates form values
      const data = {
        report_type: "Inventory",
        category_name: reportName.value,
        range_start: months[0],
        range_end: months[endDate],
        months: months,
        months_id: monthsId, // Assign the generated months_id array
        target: quantityAggregated,
      };

      try {
        // Shows pop-up loading window
        $q.loading.show({
          message:
            "<b>Forecasting</b> is in progress.<br/><span class='text-italic'>Please wait...</span>",
          html: true,
          boxClass: "bg-white text-black rounded-borders q-pa-xl",
          spinnerColor: "primary",
        });
        loading.value = true;

        let status;

        // Add the new data to the server
        await AddForecastData(data).then((response) => {
          status = response;
        });

        if (status !== null) {
          //Actually initiates Forecast ML process
          ForecastInventory()
            .then((response) => {
              //Hides loading components
              loading.value = false;
              $q.loading.hide();

              // If there is an error, error notif is shown
              if (response.errors !== "") {
                $q.notify({
                  position: $q.screen.width < 767 ? "top" : "bottom-right",
                  classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
                  html: true,
                  message: `<div class="text-bold">Forecasting failed!</div> Cannot forecast with less than two samples.`,
                });
              } else {
                //If no errors, will push the forecasting pg
                router.push({ path: "/forecast-inventory" });
              }
            })
            .catch((error) => {
              //Hides loading components
              $q.loading.hide();
              loading.value = false;

              // If there is an error, error notif is shown
              if (error.message === "Request failed with status code 500") {
                $q.notify({
                  position: $q.screen.width < 767 ? "top" : "bottom-right",
                  classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
                  html: true,
                  message: `<div class="text-bold">Network problem!</div> Please try again.`,
                });
              } else {
                // Post error notif
                $q.notify({
                  position: $q.screen.width < 767 ? "top" : "bottom-right",
                  classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
                  html: true,
                  message: `<div class="text-bold">Forecasting failed!</div> Please try again.`,
                });
              }

              // console.error(
              //   "Error during forecast processing:",
              //   error.response.data
              // );
            });
        }
      } catch (error) {
        // Post error notif
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
          html: true,
          message: `<div class="text-bold">Unable to add forecast data!</div> Please try again.`,
        });
      }
    };

    // Data to forecast reference
    let dataToForecast = ref([]);

    // Function to add forecast data to db
    const addForecastData = () => {
      // Ensures that forecast collection is empty first
      FetchForecastData("forecasts", {
        endpoint: "",
        params: "",
      })
        .then((response) => {
          dataToForecast.value = response;
          dataToForecast.value.forEach((record) => {
            ResetForecastData({ _id: record._id });
          });
        })
        .finally(() => {
          // Will process the forecast
          // after resetting forecast collection
          toProcessForecast();
        });
    };

    const userType = LocalStorage.getItem("userSession");
    const checkIfAdmin = Boolean(userType.isAdmin === true);

    // Function to handle numeric input validation
    const validateNumericInput = (event) => {
      const inputChar = String.fromCharCode(event.keyCode);
      const isNumeric = /^\d+$/.test(inputChar);

      if (!isNumeric) {
        event.preventDefault();
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
          html: true,
          message: `<div class="text-bold">Please input only numbers!</div>`,
        });
      }
    };

    return {
      Search,
      currentRows,
      router,
      rows,
      columns,
      pagination,
      updatePagination,
      showAllRows,
      form,
      isFormValid,
      fetchAll,
      addInventoryData,
      pushAccount,
      editRecord,
      rememberRowToDelete,
      deleteRecord,
      link,
      selectedInventoryForBooks,
      selectedInventoryForUniforms,
      selectedInventoryForPajahs,
      addForecastData,
      loading,
      checkIfAdmin,
      validateNumericInput,

      // References
      addNewRecordDialog: ref(false),
      editRecordDialog: ref(false),
      deleteRecordDialog: ref(false),
    };
  },
};
