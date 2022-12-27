import styled from "styled-components";

export const MainContainer = styled.footer`
	z-index: 999; // To keep player/footer upfront
	display: flex;
	position: fixed;
	bottom: 0;
	align-items: center;
	margin: 15px;
	width: calc(100vw - 30px);
	height: 60px;
	border-radius: 10px;
	background-color: rgba(0, 21, 28, 0.3);
	background-image: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.09),
		rgba(0, 21, 28, 0.3)
	);
	box-shadow: 2px 2px 15px ${({ theme }) => theme.primaryStart};
	backdrop-filter: blur(12px);
`;

export const LeftContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	background: transparent;
	/* padding-left: 2%; */
`;

export const RightContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	background: transparent;
	justify-content: flex-end;
	padding-right: 2%;
`;
