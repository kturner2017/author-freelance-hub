import useIsMobile from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`sidebar ${isMobile ? 'mobile' : ''}`}>
      <ul>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
        <li>
          <Link to="/for-authors">For Authors</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
