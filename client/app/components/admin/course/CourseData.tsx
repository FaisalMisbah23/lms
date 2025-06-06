"use client"

import { styles } from "@/app/style/style"
import type { FC } from "react"
import toast from "react-hot-toast"
import { AiOutlinePlusCircle } from "react-icons/ai"

type Props = {
  benefits: { title: string }[]
  setBenefits: (benefits: { title: string }[]) => void
  prerequisites: { title: string }[]
  setPrerequisites: (prerequisites: { title: string }[]) => void
  active: number
  setActive: (active: number) => void
}

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits]
    updatedBenefits[index].title = value
    setBenefits(updatedBenefits)
  }

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }])
  }

  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites]
    updatedPrerequisites[index].title = value
    setPrerequisites(updatedPrerequisites)
  }

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }])
  }

  const prevButton = () => {
    setActive(active - 1)
  }

  const handleOptions = () => {
    // Modified validation to check if there's at least one non-empty benefit and prerequisite
    if (benefits.some((benefit) => benefit.title !== "") && prerequisites.some((prereq) => prereq.title !== "")) {
      setActive(active + 1)
    } else {
      toast.error("Please fill at least one benefit and prerequisite to continue!")
    }
  }

  return (
    <div className="w-[80%] m-auto mt-15 800px:mt-24 block">
      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the benefits for students in this course?
        </label>
        <br />

        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            name=""
            placeholder="You will be able to build a full stack LMS Platform..."
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>

      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the prerequisites for starting this course?
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type="text"
            key={index}
            name=""
            placeholder="You need basic knowledge of MERN stack"
            required
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 m-[20px] cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default CourseData