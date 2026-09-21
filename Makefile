IMAGE = node_chatroom
STAMP = .$(IMAGE)_build.stamp

$(STAMP): Dockerfile package.json
	docker build -f ./Dockerfile . -t $(IMAGE)
	touch $(STAMP)

.PHONY: docker-run-shell
docker-run-shell: $(STAMP)
	MSYS_NO_PATHCONV=1 docker run  -it --rm --mount type=bind,source="$(CURDIR)/chatroom",target="/home/node/chatroom" --name $(IMAGE)_test $(IMAGE) /bin/sh --login

.PHONY: docker-run-dev
docker-run-dev: $(STAMP)
	docker run -it --rm  --mount type=bind,source="$(CURDIR)/chatroom",target="/home/node/chatroom" -p 1775:1775 --name $(IMAGE) $(IMAGE) npm run dev

