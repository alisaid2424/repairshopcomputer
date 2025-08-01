import { BackButton } from "@/components/BackButton";
import LottieHandler from "@/lib/LottieHandler";

const NotFoundPage = () => {
  return (
    <section className="flex items-center justify-center flex-col min-h-[calc(100vh-115px)] px-4">
      <div className="w-full max-w-md">
        <LottieHandler
          type="notFound"
          message="Page Not Found. Please check the URL and try again."
        />
      </div>

      <BackButton
        title="Go Back"
        variant="default"
        className="rounded-full mt-8"
      />
    </section>
  );
};

export default NotFoundPage;
