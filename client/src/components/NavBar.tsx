import { NavLink } from "react-router-dom";
import { useCertification } from "../lib/certification";

export default function NavBar() {
  const { certifications, certId, setCertId } = useCertification();

  return (
    <nav className="navbar">
      <div className="navbar-brand">GH Certifications Mock Drill</div>
      <div className="navbar-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/practice">Practice</NavLink>
        <NavLink to="/exam">Mock Exam</NavLink>
        <NavLink to="/history">History</NavLink>
      </div>
      {certifications.length > 0 && (
        <select
          className="navbar-cert-select"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          aria-label="Select certification"
        >
          {certifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortName}
            </option>
          ))}
        </select>
      )}
    </nav>
  );
}
