import type { StructuredResume } from "../../types/structuredResume";

interface Props {
  resume: StructuredResume;
}

const ResumeRenderer: React.FC<Props> = ({ resume }) => {
  return (
    <div className="bg-white text-black rounded-2xl p-10 shadow-xl max-w-4xl mx-auto">
      {resume.header?.name && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{resume.header.name}</h1>

          <div className="text-sm text-gray-600 mt-2 space-x-2">
            {resume.header.email && <span>{resume.header.email}</span>}
            {resume.header.phone && <span> • {resume.header.phone}</span>}
            {resume.header.location && <span> • {resume.header.location}</span>}
          </div>

          {resume.header.links?.map((link, i) => (
            <div key={i} className="text-blue-600 text-sm">
              {link.label}: {link.url}
            </div>
          ))}
        </div>
      )}

      {resume.sections.map((section, idx) => {
        if (section.type === "paragraph") {
          return (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </div>
          );
        }

        if (section.type === "experience") {
          return (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">
                {section.title}
              </h2>

              {section.items?.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>{item.heading}</span>
                    <span>{item.subheading}</span>
                  </div>

                  <ul className="list-disc ml-6 mt-2">
                    {item.bullets?.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }

        if (section.type === "list") {
          return (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-bold border-b pb-1 mb-2">
                {section.title}
              </h2>
              <ul className="list-disc ml-6">
                {section.items?.map((item, i) => (
                  <li key={i}>{item.value}</li>
                ))}
              </ul>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ResumeRenderer;
