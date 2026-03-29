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

};

export default apiEndpoints;
