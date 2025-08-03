import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Data", 
    "Course Content",
    "Course Preview",
  ];

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
        {options.map((option: string, index: number) => (
          <div
            key={index}
            className={`flex items-center space-x-3 cursor-pointer transition-all duration-200 ${
              active >= index ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => setActive(index)}
          >
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                active > index
                  ? "bg-primary text-primary-foreground"
                  : active === index
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {active > index ? (
                <IoMdCheckmark className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="flex-1 min-w-0">
              <h5
                className={`font-medium text-sm sm:text-base transition-colors duration-200 ${
                  active >= index
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {option}
              </h5>
            </div>

            {/* Connector Line */}
            {index < options.length - 1 && (
              <div className="hidden sm:block flex-1 h-0.5 mx-4">
                <div
                  className={`h-full transition-all duration-200 ${
                    active > index ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden w-full bg-muted rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((active + 1) / options.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default CourseOptions;