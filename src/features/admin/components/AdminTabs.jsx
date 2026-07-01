import {
  BarChart3,
  Filter,
  Users,
  BookOpen,
} from "lucide-react";

const tabs = [
  {
    id: "stats",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "segmentation",
    label: "Segmentos",
    icon: Filter,
  },
  {
    id: "users",
    label: "Alumnos",
    icon: Users,
  },
  {
    id: "classes",
    label: "Clases",
    icon: BookOpen,
  },
];

const AdminTabs = ({
  active,
  onChange,
}) => {

  return (

    <div className="flex flex-wrap gap-3">

      {tabs.map((tab) => {

        const Icon = tab.icon;

        return (

          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={
              active === tab.id
                ? "btn-primary"
                : "btn-secondary"
            }
          >

            <Icon size={16} />

            {tab.label}

          </button>

        );

      })}

    </div>

  );

};

export default AdminTabs;