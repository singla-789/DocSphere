const BASE_URL = "http://localhost:8080/api/v1.0";

const apiEndpoints = {
  // ─── Files ────────────────────────────────────────────────────────────────

  // GET — fetch all files for the logged-in user
  FETCH_MY_FILES: `${BASE_URL}/files/my`,

  // PATCH — toggle public/private on a single file
  TOGGLE_FILE_PUBLIC: (fileId) => `${BASE_URL}/files/${fileId}/toggle-public`,

  // DELETE — delete a single file
  DELETE_FILE: (fileId) => `${BASE_URL}/files/${fileId}`,

    // GET — download a single file
  DOWNLOAD_FILE: (fileId) => `${BASE_URL}/files/download/${fileId}`,

  // GET — preview a single file inline
  PREVIEW_FILE: (fileId) => `${BASE_URL}/files/preview/${fileId}`,

  // GET — fetch a public file's metadata
  GET_PUBLIC_FILE: (fileId) => `${BASE_URL}/files/public/${fileId}`,

  // get User credits
  GET_CREDITS : `${BASE_URL}/users/credits`,

  // upload files
  UPLOAD_FILES : `${BASE_URL}/files/upload`,

  // ─── Payments ─────────────────────────────────────────────────────────────
  CREATE_ORDER: `${BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
  GET_PAYMENT_HISTORY: `${BASE_URL}/payments/history`,

};

export default apiEndpoints;
