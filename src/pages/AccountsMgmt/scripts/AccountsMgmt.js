import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, Loading, LocalStorage } from "quasar";
import { Search, currentRows } from "../../../server/index";
import Filters from "../../../components/FiltersComp.vue";
import Pagination from "../../../components/PaginationComp.vue";

// fetch Accounts data from db
import {
  FetchAccounts,
  FetchAccountsData,
  AddAccount,
  EditAccount,
  DeleteAccount,
} from "../../../server/index";

export default {
  components: {
    Filters,
    Pagination,
  },

  setup() {
    const isWebMaster = ref(false);

    // Check if account is webmaster
    // If not, password column is not editable
    const checkIfWebMaster = () => {
      const userData = LocalStorage.getItem("userData");
      if (userData.email_address === "admin@admin.com") {
        isWebMaster.value = true;
      }
    };

    onMounted(() => {
      // FetchAccounts().then((response) => {
      //   rows.value = response;
      //   currentRows.value = rows.value.slice(0, pagination.value.rowsPerPage);
      // });

      FetchAccountsData("accounts", {
        endpoint: "",
        params: { user_type: selectedUserType.value },
      }).then((response) => {
        rows.value = response;
        Search.value = rows.value.slice(0, pagination.value.rowsPerPage);
      });

      checkIfWebMaster();
    });

    const router = useRouter(); // Router
    const $q = useQuasar(); // q

    // State to control password visibility
    const isPasswordVisible = ref(true);

    let rows = ref([]); // Rows

    // Column Headers
    const columns = [
      {
        name: "prefix",
        field: "prefix",
        label: "Prefix",
        align: "center",
        sortable: false,
        headerStyle: "text-align: left; padding-left: 56px;",
        style:
          "font-weight: normal; text-align: left; padding-left: 56px; width: 88px;",
      },
      {
        name: "fullName",
        // field: "first_name",
        field: (rows) => rows.first_name + "\n" + rows.last_name,
        label: "Full Name",
        align: "left",
        sortable: true,
        style: "font-weight: normal;",
      },
      /* {
        name: "lastName",
        field: "last_name",
        label: "Last Name",
        align: "left",
        sortable: true,
        style: "font-weight: normal;",
      }, */
      {
        name: "emailAddress",
        field: "email_address",
        label: "Email Address",
        align: "left",
        sortable: false,
        style: "font-weight: normal; padding-right: 32px !important;",
      },
      {
        name: "username",
        field: "username",
        label: "Username",
        align: "left",
        sortable: false,
        style: "font-weight: normal; padding-right: 32px !important;",
      },
      {
        name: "password",
        // field: "password",
        field: (rows) => "**********",
        label: "Password",
        align: "left",
        sortable: false,
        style: "font-weight: normal; padding-right: 32px !important;",
      },
      /* {
        name: "userType",
        field: "user_type",
        label: "User Type",
        align: "left",
        sortable: false,
        style: "font-weight: normal;",
      }, */
      {
        name: "actions",
        label: "Action",
        align: "center",
        field: "actions",
        headerStyle: "text-align: left;",
        style: "text-align: center;  width: 80px;",
      },
    ];

    // Pagination
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    /*  This function updates the row data in the column whenever called.
        It updates the startIndex and endIndex and then proceed with updating the currentRows or Search.
        currentRows/Search are the rows shown in the table. */

    const updatePagination = () => {
      const startIndex =
        (pagination.value.page - 1) * pagination.value.rowsPerPage;
      const endIndex = startIndex + pagination.value.rowsPerPage - 1;
      Search.value = rows.value.slice(startIndex, endIndex + 1);
    };

    // Form
    const form = ref({
      id: null,
      prefix: "",
      userType: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      username: "",
      password: "",
    });

    // Function to check if form is valid
    const isFormValid = () => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return (
        form.value.prefix !== "" &&
        form.value.userType.length !== 0 &&
        form.value.firstName !== "" &&
        form.value.lastName !== "" &&
        form.value.emailAddress !== "" &&
        pattern.test(form.value.emailAddress) &&
        form.value.username !== "" &&
        form.value.password !== ""
      );
    };

    // Function to add account
    const addAccount = () => {
      // let status = false;

      FetchAccounts().then((response) => {
        /* Counts the accounts first to ensure new id
      in accordance with INT format. */
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
          id: `${newId}`,
          prefix: form.value.prefix,
          user_type: form.value.userType,
          first_name: form.value.firstName,
          last_name: form.value.lastName,
          email_address: form.value.emailAddress,
          username: form.value.username,
          password: form.value.password,
        };

        AddAccount(data).then((response) => {
          Number(data.id); // Ensure newId is a number

          let status = Boolean(response !== 200);
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
        // .catch((error) => {
        //   console.error("Error adding account:", error);
        //   // Notify failure due to server error or email already exists
        //   $q.notify({
        //     // Post notification on lower right side
        //     position: $q.screen.width < 767 ? "top" : "bottom-right",
        //     classes: `${
        //       status == true ? "my-success-notif" : "my-error-notif"
        //     }
        //     ${
        //       $q.screen.width < 767
        //         ? "q-px-lg q-pt-none q-pb-none q-mb-md"
        //         : "q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md"
        //     }`,
        //     html: true,
        //     message:
        //       status == true
        //         ? `<div class="text-bold">Account added Succesfully!</div> The new ${form.value.userType} account has been added.`
        //         : `<div class="text-bold">Failed to add the new account!</div> Server error or the account already exists.`,
        //   });
        // });

        setTimeout(() => {
          // After adding data, fetch updated data based on the user type
          FetchAccountsData("accounts", {
            endpoint: "",
            params: { user_type: data.user_type },
          }).then((response) => {
            rows.value = response;
            Search.value = rows.value;
            link.value = data.user_type;
          });

          fetchAll();
        }, 3000);
      });

      // console.log("2" + status);
      // setTimeout(() => {
      //   if (status === false) {
      //     $q.notify({
      //       // Post notification on lower right side
      //       position: $q.screen.width < 767 ? "top" : "bottom-right",
      //       classes: `${
      //         $q.screen.width < 767
      //           ? "my-error-notif q-px-lg q-pt-none q-pb-none q-mb-md`,q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md"
      //           : "my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md"
      //       }`,
      //       html: true,
      //       message: `<div class="text-bold">Failed to add the new account!</div> Server error or the account already exists.`,
      //     });
      //   }
      // }, 1000);
    };

    // Function to clear all inputs when cancel is clicked
    const fetchAll = () => {
      form.value.prefix = "";
      form.value.userType = "";
      form.value.firstName = "";
      form.value.lastName = "";
      form.value.emailAddress = "";
      form.value.username = "";
      form.value.password = "";
    };

    /* Method to handle when the row is clicked.
    Prepopulates Edit Input Fields in accordance with the row id */
    const pushAccount = (row) => {
      form.value.id = row._id;
      form.value.prefix = row.prefix;
      form.value.userType = row.user_type;
      form.value.firstName = row.first_name;
      form.value.lastName = row.last_name;
      form.value.emailAddress = row.email_address;
      form.value.username = row.username;
      form.value.password = row.password;
    };

    // Function to Edit Account details
    const editAccount = () => {
      // Equates form values
      const dataToEdit = {
        _id: form.value.id,
        prefix: form.value.prefix,
        user_type: form.value.userType,
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email_address: form.value.emailAddress,
        username: form.value.username,
        password: form.value.password,
      };

      // Actually edit details
      EditAccount(dataToEdit)
        .then((response) => {
          let status = Boolean(response);
          $q.notify({
            // Post notification on lower right side
            position: $q.screen.width < 767 ? "top" : "bottom-right",
            classes: `${status ? "my-success-notif" : "my-error-notif"}
            ${
              $q.screen.width < 767
                ? "q-px-lg q-pt-none q-pb-none q-mb-md"
                : "q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md"
            }`,
            html: true,
            message: status
              ? `<div class="text-bold">Member's Info was changed succesfully!</div> ${dataToEdit.first_name}'s credentials has been updated.`
              : `<div class="text-bold">Failed to update ${dataToEdit.first_name}'s credentials!</div>`,
          });
        })
        .finally(() => {
          // After updating the user type, fetch data again based on the new user type
          FetchAccountsData("accounts", {
            endpoint: "",
            params: { user_type: form.value.userType },
          }).then((response) => {
            rows.value = response;
            Search.value = rows.value;
            link.value = form.value.userType;
            fetchAll();
          });
        });
    };

    // Reference variable for the row to delete
    const rowToDelete = ref({
      id: null,
      prefix: [],
      userType: [],
      firstName: "",
      lastName: "",
      emailAddress: "",
      username: "",
      password: "",
    });

    // Function to remember the row values when delete button is clicked
    const rememberRowToDelete = (row) => {
      // Copy the row values to the reactive variable
      rowToDelete.value.id = row._id;
      rowToDelete.value.prefix = row.prefix;
      rowToDelete.value.userType = row.user_type;
      rowToDelete.value.firstName = row.first_name;
      rowToDelete.value.lastName = row.last_name;
      rowToDelete.value.emailAddress = row.email_address;
      rowToDelete.value.username = row.username;
      rowToDelete.value.password = row.password;
    };

    // Function to delete the account
    const deleteAccount = () => {
      /* if (!rowToDelete.value) {
        // No row selected, do nothing
        return;
      } */

      // Perform delete operation using the rowToDelete
      DeleteAccount({ _id: rowToDelete.value.id });

      // Post notification on lower right side of the page
      $q.notify({
        // Post notification on lower right side
        position: $q.screen.width < 767 ? "top" : "bottom-right",
        classes: `${
          $q.screen.width < 767
            ? "my-success-notif q-px-lg q-pt-none q-pb-none q-mb-md"
            : "my-success-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md"
        }`,
        html: true,
        message: `<div class="text-bold">Account deleted successfully!</div> ${rowToDelete.value.firstName}'s account has been deleted.`,
      });

      setTimeout(() => {
        // After adding data, fetch updated data based on the user type
        FetchAccountsData("accounts", {
          endpoint: "",
          params: { user_type: rowToDelete.value.userType },
        }).then((response) => {
          rows.value = response;
          Search.value = rows.value;
          link.value = rowToDelete.value.userType;
        });
      }, 500);
    };

    let link = ref("Admin");

    //Current user type selector reference
    let selectedUserType = ref("Admin");

    const selectedUserTypeStaff = () => {
      selectedUserType.value = "Staff";

      // After updating the user type, you might want to fetch data again based on the new user type
      FetchAccountsData("accounts", {
        endpoint: "",
        params: { user_type: selectedUserType.value },
      }).then((response) => {
        rows.value = response;
        Search.value = rows.value.slice(0, pagination.value.rowsPerPage);
      });
    };

    const selectedUserTypeAdmin = () => {
      selectedUserType.value = "Admin";

      // After updating the user type, you might want to fetch data again based on the new user type
      FetchAccountsData("accounts", {
        endpoint: "",
        params: { user_type: selectedUserType.value },
      }).then((response) => {
        rows.value = response;
        Search.value = rows.value.slice(0, pagination.value.rowsPerPage);
      });
    };

    const handleInput = (event) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check if the input is a valid email address
      if (!pattern.test(form.value.emailAddress)) {
        // Display a notification if the input is invalid
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: `my-error-notif q-px-lg q-pt-none q-pb-none q-mr-lg q-mb-md`,
          html: true,
          message: `<div class="text-bold">Please input a valid email address!</div>`,
        });
      }
    };

    return {
      router,
      rows,
      columns,
      updatePagination,
      pagination,
      currentRows,
      Search,
      form,
      isFormValid,
      addAccount,
      fetchAll,
      pushAccount,
      editAccount,
      rowToDelete,
      deleteAccount,
      rememberRowToDelete,
      selectedUserTypeStaff,
      selectedUserTypeAdmin,
      link,
      isWebMaster,
      handleInput,

      // References
      addAccountDialog: ref(false),
      editAccountDialog: ref(false),
      deleteAccountDialog: ref(false),
      emailAddress: ref(null),
      isPwd: ref(true),
      password: ref(""),
      prefix: ["Ms.", "Mr.", "Mrs.", "Mx."],
      userType: ["Admin", "Staff"],
    };
  },
};
