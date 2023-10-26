"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";

type Props = React.HTMLAttributes<HTMLDivElement>;

const OAuthButtons = ({ className, ...props }: Props) => {
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function toastNotifier(mode: "welcome" | "error" = "welcome") {
    if (mode === "welcome") {
      toast({
        title: "Welcome!",
        description: "You've successfully signed in.",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  async function googleSignInHandler() {
    setIsGoogleLoading(true);

    try {
      await signIn("google");
      toastNotifier();
    } catch (error) {
      toastNotifier("error");
    }

    setIsGoogleLoading(false);
  }

  async function githubSignInHandler() {
    setIsGithubLoading(true);

    try {
      await signIn("github");
      toastNotifier();
    } catch (error) {
      toastNotifier("error");
    }

    setIsGithubLoading(false);
  }
  return (
    <div className={className} {...props}>
      <Button
        type="button"
        variant="outline"
        disabled={isGoogleLoading}
        onClick={googleSignInHandler}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.Google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={isGithubLoading}
        onClick={githubSignInHandler}
      >
        {isGithubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.GitHub className="mr-2 h-4 w-4" />
        )}
        Github
      </Button>
    </div>
  );
};

export default OAuthButtons;
