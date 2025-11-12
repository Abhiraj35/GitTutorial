import { Heart, Github } from "lucide-react";
export default function Footer() {
  return (
    <footer className="border-t border-border ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          {/* Left */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-destructive fill-red-500 " />
            <span>by Abhiraj Kumar</span>
          </div>


          {/* Right */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm"
            >
              Feedback
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
