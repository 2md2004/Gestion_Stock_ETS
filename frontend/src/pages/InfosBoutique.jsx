import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getBoutique, saveBoutique, uploadLogo } from "../services/BoutiqueService";
import { API_URL } from "../constants/server";
import "../styles/Profile.css";

const InfosBoutique = () => {
  const [infos, setInfos] = useState({
    nom: "",
    ninea: "",
    rccm: "",
    telephone: "",
    email: "",
    adresse: "",
    logoPath: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBoutique();
  }, []);

  const loadBoutique = async () => {
    try {
      const data = await getBoutique();
      if (data && data.id) {
        setInfos({
          nom: data.nom || "",
          ninea: data.ninea || "",
          rccm: data.rccm || "",
          telephone: data.telephone || "",
          email: data.email || "",
          adresse: data.adresse || "",
          logoPath: data.logoPath || null,
        });
        if (data.logoPath) {
          setLogoPreview(`${API_URL}images/${data.logoPath}`);
        }
      }
    } catch (error) {
      console.error("Erreur chargement boutique:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setInfos((prev) => ({ ...prev, logoPath: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoPath = infos.logoPath;

      if (logoFile) {
        const logoResult = await uploadLogo(logoFile);
        logoPath = logoResult.filename;
      }

      await saveBoutique({
        ...infos,
        logoPath,
      });

      toast.success("Informations de la boutique enregistrées");
      loadBoutique();
      setLogoFile(null);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilePage">
      <div className="profileCard" style={{ maxWidth: "700px" }}>
        <div className="profileTop">
          <div className="profileBigAvatar" style={{ borderRadius: "14px" }}>
            <i className="bi bi-shop"></i>
          </div>
          <div className="profileIdentity">
            <h2>Informations de la boutique</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profileSection">
            <h3>Logo</h3>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "14px",
                  border: "2px dashed #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background: "#f8fafc",
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <i className="bi bi-image" style={{ fontSize: "30px", color: "#94a3b8" }}></i>
                )}
              </div>
              <div>
                <label
                  htmlFor="logoInput"
                  className="btn btn-sm text-white"
                  style={{ backgroundColor: "#002050", cursor: "pointer" }}
                >
                  <i className="bi bi-upload me-1"></i>
                  Choisir un logo
                </label>
                <input
                  type="file"
                  id="logoInput"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
                {logoPreview && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={handleRemoveLogo}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="profileSection">
            <h3>Informations générales</h3>
            <div className="profileInfoGrid">
              <div className="passwordField">
                <label>
                  <i className="bi bi-shop me-1" style={{ color: "#D09018" }}></i>
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  name="nom"
                  value={infos.nom}
                  onChange={handleChange}
                  placeholder="Ex: Boutik ETS"
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-upc-scan me-1" style={{ color: "#D09018" }}></i>
                  NINEA
                </label>
                <input
                  type="text"
                  name="ninea"
                  value={infos.ninea}
                  onChange={handleChange}
                  placeholder="Ex: 123456789"
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-file-earmark-text me-1" style={{ color: "#D09018" }}></i>
                  RCCM
                </label>
                <input
                  type="text"
                  name="rccm"
                  value={infos.rccm}
                  onChange={handleChange}
                  placeholder="Ex: SN-DKR-2024-B-12345"
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-telephone me-1" style={{ color: "#D09018" }}></i>
                  Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={infos.telephone}
                  onChange={handleChange}
                  placeholder="Ex: +221 77 123 45 67"
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-envelope me-1" style={{ color: "#D09018" }}></i>
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={infos.email}
                  onChange={handleChange}
                  placeholder="Ex: contact@boutique.com"
                />
              </div>

              <div className="passwordField">
                <label>
                  <i className="bi bi-geo-alt me-1" style={{ color: "#D09018" }}></i>
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={infos.adresse}
                  onChange={handleChange}
                  placeholder="Ex: Rue 10, Dakar"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="passwordButton mt-3"
            disabled={loading}
          >
            <i className={`bi ${loading ? "bi-hourglass-split" : "bi-check-circle"} me-2`}></i>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfosBoutique;
