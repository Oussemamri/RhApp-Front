import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import axios from "axios";

const AddProfile = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pole, setPole] = useState("");
  const [domaine, setDomaine] = useState("");
  const [metier, setMetier] = useState("");
  const [filiere, setFiliere] = useState("");
  const [lieuDeTravail, setLieuDeTravail] = useState("");
  const [responsable, setResponsable] = useState("");
  const [email, setEmail] = useState("");
  const [civilite, setCivilite] = useState("");
  const [sexe, setSexe] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [adresseDomicile, setAdresseDomicile] = useState("");
  const [image, setImage] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  const fieldOrder = [
    "nom",
    "prenom",
    "pole",
    "domaine",
    "metier",
    "filiere",
    "lieuDeTravail",
    "responsable",
    "email",
    "civilite",
    "sexe",
    "nationalite",
    "dateNaissance",
    "lieuNaissance",
    "adresseDomicile",
    "image",
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "employeeId") {
      setSelectedEmployeeId(value);
      if (value) {
        fetchProfile(value);
      } else {
        resetFields();
        setCurrentFieldIndex(0);
      }
    } else {
      if (name === "nom") setNom(value);
      if (name === "prenom") setPrenom(value);
      if (name === "pole") setPole(value);
      if (name === "domaine") setDomaine(value);
      if (name === "metier") setMetier(value);
      if (name === "filiere") setFiliere(value);
      if (name === "lieuDeTravail") setLieuDeTravail(value);
      if (name === "responsable") setResponsable(value);
      if (name === "email") setEmail(value);
      if (name === "civilite") setCivilite(value);
      if (name === "sexe") setSexe(value);
      if (name === "nationalite") setNationalite(value);
      if (name === "dateNaissance") setDateNaissance(value);
      if (name === "lieuNaissance") setLieuNaissance(value);
      if (name === "adresseDomicile") setAdresseDomicile(value);
      if (name === "image") setImage(files ? files[0] : null);
    }
  };

  const fetchProfile = async (id) => {
    try {
      const user = await axios.get(`http://localhost:3000/users/${id}`);
      const response = await axios.get(`http://localhost:3000/profile/${user.data.profile.id}`);
      const profile = response.data;
      user.profile = profile;
      localStorage.setItem("user", JSON.stringify(user.data));

      setNom(profile.nom || "");
      setPrenom(profile.prenom || "");
      setPole(profile.pole || "");
      setDomaine(profile.domaine || "");
      setMetier(profile.metier || "");
      setFiliere(profile.filiere || "");
      setLieuDeTravail(profile.lieuDeTravail || "");
      setResponsable(profile.responsable || "");
      setEmail(profile.email || "");
      setCivilite(profile.civilite || "");
      setSexe(profile.sexe || "");
      setNationalite(profile.nationalite || "");
      setDateNaissance(profile.dateNaissance || "");
      setLieuNaissance(profile.lieuNaissance || "");
      setAdresseDomicile(profile.adresseDomicile || "");
      setImage(profile.image || null);

      setCurrentFieldIndex(fieldOrder.length);
    } catch (error) {
      resetFields();
      setCurrentFieldIndex(0);
      console.error("Error fetching profile", error);
    }
  };

  const resetFields = () => {
    setNom("");
    setPrenom("");
    setPole("");
    setDomaine("");
    setMetier("");
    setFiliere("");
    setLieuDeTravail("");
    setResponsable("");
    setEmail("");
    setCivilite("");
    setSexe("");
    setNationalite("");
    setDateNaissance("");
    setLieuNaissance("");
    setAdresseDomicile("");
    setImage(null);
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (!isSubmit) {
      setIsSubmit(true);
      if (currentFieldIndex < fieldOrder.length) {
        setCurrentFieldIndex(currentFieldIndex + 1);
        setIsSubmit(false);
      } else {
        if (validateForm()) {
          const formData = new FormData();
          formData.append("nom", nom);
          formData.append("prenom", prenom);
          formData.append("pole", pole);
          formData.append("domaine", domaine);
          formData.append("metier", metier);
          formData.append("filiere", filiere);
          formData.append("lieuDeTravail", lieuDeTravail);
          formData.append("responsable", responsable);
          formData.append("email", email);
          formData.append("civilite", civilite);
          formData.append("sexe", sexe);
          formData.append("nationalite", nationalite);
          formData.append("dateNaissance", dateNaissance);
          formData.append("lieuNaissance", lieuNaissance);
          formData.append("adresseDomicile", adresseDomicile);
          if (image) {
            formData.append("image", image);
          }
          try {
            const response = await axios.post(
              `http://localhost:3000/profile/${selectedEmployeeId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setMessage("Profile created successfully!");
            resetFields();
            setCurrentFieldIndex(0);
            setErrorMessage("");
          } catch (error) {
            setErrorMessage("There was an error creating the profile!");
            console.error("Error creating profile", error);
          }
        } else {
          setErrorMessage("Please correct the errors in the form.");
        }
        setIsSubmit(false);
      }
    }
  };

  const validateForm = () => {

    return true;
  };

  const nationalities = ["American", "French", "German", "Tunisian", "Other"];
  const sexes = ["Man", "Woman"];

  const renderField = (field) => {
    switch (field) {
      case "nom":
        return (
          <FormGroup key="nom">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-single-copy-04" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Nom"
                type="text"
                name="nom"
                value={nom}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "prenom":
        return (
          <FormGroup key="prenom">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-single-copy-04" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Prenom"
                type="text"
                name="prenom"
                value={prenom}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "pole":
        return (
          <FormGroup key="pole">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-building" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Pole"
                type="text"
                name="pole"
                value={pole}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "domaine":
        return (
          <FormGroup key="domaine">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-briefcase-24" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Domaine"
                type="text"
                name="domaine"
                value={domaine}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "metier":
        return (
          <FormGroup key="metier">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-briefcase-24" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Metier"
                type="text"
                name="metier"
                value={metier}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "filiere":
        return (
          <FormGroup key="filiere">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-hat-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Filiere"
                type="text"
                name="filiere"
                value={filiere}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "lieuDeTravail":
        return (
          <FormGroup key="lieuDeTravail">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-pin-3" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Lieu de Travail"
                type="text"
                name="lieuDeTravail"
                value={lieuDeTravail}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "responsable":
        return (
          <FormGroup key="responsable">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-single-02" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Responsable"
                type="text"
                name="responsable"
                value={responsable}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "email":
        return (
          <FormGroup key="email">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "civilite":
        return (
          <FormGroup key="civilite">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-circle-08" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Civilite"
                type="text"
                name="civilite"
                value={civilite}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "sexe":
        return (
          <FormGroup key="sexe">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-favourite-28" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="sexe"
                value={sexe}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              >
                <option value="">Select Sex</option>
                {sexes.map((sex, index) => (
                  <option key={index} value={sex}>
                    {sex}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </FormGroup>
        );
      case "nationalite":
        return (
          <FormGroup key="nationalite">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-world-2" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                name="nationalite"
                value={nationalite}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              >
                <option value="">Select Nationality</option>
                {nationalities.map((nationality, index) => (
                  <option key={index} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </FormGroup>
        );
      case "dateNaissance":
        return (
          <FormGroup key="dateNaissance">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-calendar-grid-58" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Date de Naissance"
                type="date"
                name="dateNaissance"
                value={dateNaissance}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "lieuNaissance":
        return (
          <FormGroup key="lieuNaissance">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-square-pin" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Lieu de Naissance"
                type="text"
                name="lieuNaissance"
                value={lieuNaissance}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "adresseDomicile":
        return (
          <FormGroup key="adresseDomicile">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-square-pin" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Adresse Domicile"
                type="text"
                name="adresseDomicile"
                value={adresseDomicile}
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      case "image":
        return (
          <FormGroup key="image">
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-image" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="file"
                name="image"
                onChange={handleInputChange}
                style={{ fontSize: "18px" }}
              />
            </InputGroup>
          </FormGroup>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white pb-5">
                    <div className="text-muted text-center mb-3">
                      <small>Add New Profile</small>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>Fill in the details below</small>
                    </div>
                    <Form role="form" onSubmit={handleAddProfile}>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="select"
                            name="employeeId"
                            value={selectedEmployeeId}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Employee</option>
                            {employees.map((manager) => (
                              <option key={manager.id} value={manager.id}>
                                {manager.username}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                      {fieldOrder.slice(0, currentFieldIndex + 1).map((field) => renderField(field))}
                      {message && (
                        <div className="text-center mb-3 alert alert-success">
                          <small>{message}</small>
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-center mb-3 alert alert-danger">
                          <small>{errorMessage}</small>
                        </div>
                      )}
                      <div className="text-center">
                        <Button
                          className="mt-4"
                          color="primary"
                          type="submit"
                          disabled={isSubmit}
                        >
                          {currentFieldIndex < fieldOrder.length ? "Add Profile" : "Submit"}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default AddProfile;
