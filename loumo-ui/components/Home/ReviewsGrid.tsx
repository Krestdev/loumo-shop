// import { useReviews } from "@/data/data";
import { useTranslations } from "next-intl";
import { ReviewsCar } from "./ReviewsCar";

const ReviewsGrid = () => {
  //   const reviews = useReviews();
  const t = useTranslations("HomePage");
  return (
    <div className="flex flex-col gap-7 px-7 py-10 lg:py-24 max-w-[1400px] w-full">
      <h1>{t("reviews")}</h1>
      <ReviewsCar />
    </div>
  );
};

export default ReviewsGrid;
