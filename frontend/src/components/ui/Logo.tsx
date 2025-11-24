export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`${className} bg-primary flex items-center justify-center p-2`}
      style={{ borderRadius: "12px" }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <g clipPath="url(#clip0_5_568)">
          <path
            d="M18 1.125C18 5.11875 15.0258 8.41992 11.1727 8.92969C10.923 7.05234 10.0969 5.35781 8.87695 4.03242C10.2234 1.62773 12.7969 0 15.75 0H16.875C17.4973 0 18 0.502734 18 1.125ZM0 3.375C0 2.75273 0.502734 2.25 1.125 2.25H2.25C6.59883 2.25 10.125 5.77617 10.125 10.125V11.25V16.875C10.125 17.4973 9.62227 18 9 18C8.37773 18 7.875 17.4973 7.875 16.875V11.25C3.52617 11.25 0 7.72383 0 3.375Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_5_568">
            <path d="M0 0H18V18H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
